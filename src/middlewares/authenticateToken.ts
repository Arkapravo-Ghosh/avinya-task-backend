import { validateToken } from "../utils/authUtils";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: object;
};

/**
 * Middleware to authenticate the user using a JWT token.
 */
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response => {
  try {
    const token: string | undefined = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    const user = validateToken(token);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    };
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    };
    console.error("Error authenticating using JWT: ", error);
    return res.status(500).json({ message: "Internal server error" });
  };
};

export default authenticateToken;