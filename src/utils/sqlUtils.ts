import mariadb from "mariadb";
import sqlConfig from "../config/dbConfig";

const pool = mariadb.createPool(sqlConfig);

/**
 * Executes a given SQL query with optional values and retry logic.
 *
 * @param {string} query - The SQL query to be executed.
 * @param {Array} [values=[]] - An array of values to be used in the query as parameters.
 * @param {number} [retries=3] - The number of times to retry the query in case of an error.
 * @returns {Promise<*>} - A promise that resolves to the results of the query.
 * @throws {Error} - Throws an error if the query fails after all retries.
 */
const executeQuery = async (query: string, values: Array<unknown> = [], retries: number = 3): Promise<Array<object>> => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Execute the query with the provided values
    const results: Array<object> = await connection.query(query, values);

    // Release connection and return results
    await connection.end();
    return results;
  } catch (error) {
    // On error, check if retries are available
    if (retries) {

      // Decrement retries and wait for 1 second before retrying
      retries--;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await executeQuery(query, values, retries);
    } else {

      // If no retries left, throw the error
      throw error;
    };
  };
};

export default executeQuery;