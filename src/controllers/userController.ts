import { Request, Response } from "express";
import { TokenPayload } from "google-auth-library";
import { createToken, createRefreshToken, verifyGoogleToken } from "../utils/authUtils";
import executeQuery from "../utils/sqlUtils";
import generateUUID from "../utils/uuidUtils";

interface User {
  email: string;
  full_name: string;
};

/**
 * Controller to handle the login request.
 */
export const loginController = async (req: Request, res: Response) => {
  const { token } = req.body;

  // Validation
  if (!token) {
    return res.status(400).json({ message: "Invalid request" });
  };

  try {
    let user: User;

    const payload = await verifyGoogleToken(token) as TokenPayload;

    if (!payload) {
      return res.status(400).json({ message: "Invalid Google token" });
    };

    const googleuser = {
      email: payload.email,
      full_name: payload.name,
    };

    // Get the data of user from the database
    const query = "SELECT * FROM users WHERE email = ?";
    let result: User[];
    try {
      result = await executeQuery(query, [googleuser.email]) as User[];
    } catch (error) {
      if (error.code === "ER_NO_SUCH_TABLE") {
        console.warn("Table does not exist. Creating the table...");
        await executeQuery("CREATE TABLE users (user_id uuid, email varchar(250), full_name text, PRIMARY KEY (email, user_id))");
        result = await executeQuery(query, [googleuser.email]) as User[];
      } else {
        console.error("Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
      };
    };

    if (!result.length) {
      const user_id = generateUUID();
      const insertQuery = "INSERT INTO users (email, full_name, user_id) VALUES (?, ?, ?)";
      const insertValues = [googleuser.email, googleuser.full_name, user_id];
      try {
        await executeQuery(insertQuery, insertValues);
      } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ message: "Internal server error" });
      };
      user = {
        email: googleuser.email,
        full_name: googleuser.full_name,
      };
    } else {
      user = {
        email: result[0].email,
        full_name: result[0].full_name,
      };
    };

    // Create a token
    const authtoken = createToken(user);

    // Create a refresh token
    const refreshtoken = createRefreshToken(user);

    // Send the token and refresh token
    return res.status(200).json({
      message: "Login successful",
      authtoken: authtoken,
      refreshtoken: refreshtoken,
    });
  } catch (error) {
    console.error(error);
    try {
      res.status(500).json({ message: "Internal server error" });
    } catch (error) {
      console.error("Error sending Status 500:", error);
    };
    return;
  };
};

/**
 * Handle token verification status.
 */
export const verifyController = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.error("Error sending Status 200:", error);
    return res.status(500).json({ message: "Internal server error" });
  };
};