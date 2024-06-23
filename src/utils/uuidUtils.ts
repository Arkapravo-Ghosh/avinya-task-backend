import { v4 as uuidv4 } from "uuid";

/**
 *  Function to generate a UUID
 * @returns {string} - A UUID
 */
const generateUUID = (): string => {
  return uuidv4();
};

export default generateUUID;