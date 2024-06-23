import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

/**
 * Client instance to interact with the Google OAuth2 API.
 */
const client = new OAuth2Client();

/**
 * Verifies a Google ID token and returns the token payload.
 * @param {string} token - The Google ID token to verify.
 * @returns {Promise<Object|null>} The token payload if the token is valid, otherwise null.
 */
export const verifyGoogleToken = async (token: string): Promise<object | null> => {
  try {
    /**
     * Ticket with the payload of the verified token.
     */
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    /**
     * Payload of the verified token.
     */
    const payload = ticket.getPayload();

    // Return the payload
    return payload;
  } catch (error) {
    console.error(error);
    return null;
  };
};

/**
 * Creates a JWT token for the user.
 * @param {Object} user - The user object.
 * @returns {string} The JWT token.
 */
export const createToken = (user: object): string => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/**
 * Creates a JWT refresh token for the user.
 * @param {Object} user - The user object.
 * @returns {string} The JWT token.
 */
export const createRefreshToken = (user: object): string => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/**
 * Validates a JWT token and returns the token payload.
 * @param {string} token - The JWT token to validate.
 */
export const validateToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};