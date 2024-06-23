import { ConnectionConfig } from "mariadb";

const sqlConfig: ConnectionConfig = {
  host: process.env.SQL_HOST || "localhost",
  user: process.env.SQL_USER || "root",
  password: process.env.SQL_PASSWD,
  database: process.env.SQL_DB,
  port: Number(process.env.SQL_PORT) || 3306,
  connectTimeout: Number(process.env.SQL_TIMEOUT) || 100000,
};

export default sqlConfig;