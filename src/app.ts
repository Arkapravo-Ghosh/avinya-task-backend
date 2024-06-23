import express from "express";
import http, { Server } from "http";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors, { CorsOptions } from "cors";
import checkJSON from "./middlewares/checkJSON";
import * as grpc from "@grpc/grpc-js";

// Express Configuration
const app = express()
const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost",
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(process.env.PRODUCTION ? logger("combined") : logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("public")));
app.use(checkJSON);

// Server Configuration
const server: Server = http.createServer(app);
const port: number = Number(process.env.PORT) || 8000;

// Route Imports
import indexRouter from "./routes/indexRouter";
import userRouter from "./routes/userRouter";

// Route Configurations
app.use("/", indexRouter);
app.use("/user", userRouter);

// Server Configuration
server.listen(port, () => {
  console.log("Server listening on port " + port);
});

// SQL connection Test
import mariadb, { Connection } from "mariadb";
import sqlConfig from "./config/dbConfig";
const testDBConnection = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const connection: Connection = await mariadb.createConnection(sqlConfig);
    console.log(`Connected to SQL Server with ID ${connection.threadId}`);
    await connection.end();
  } catch (error) {
    if (error.code === "ER_BAD_DB_ERROR") {
      // Create database if it does not exist
      const connection: Connection = await mariadb.createConnection({
        host: sqlConfig.host,
        user: sqlConfig.user,
        password: sqlConfig.password,
        connectTimeout: sqlConfig.connectTimeout,
      });
      await connection.query(`CREATE DATABASE IF NOT EXISTS ${sqlConfig.database}`);
      console.log(`Connected to SQL Server with ID ${connection.threadId}`)
      await connection.end();
      return;
    };
    console.error("Error connecting to SQL Server:", error);
  };
};
testDBConnection();

// gRPC Configuration
const grpcServer = new grpc.Server();

// gRPC Protobuf Imports
import { loadSync } from "@grpc/proto-loader";
import { ReflectionService } from "@grpc/reflection";

// EdfStream Service
import { ProtoGrpcType as EdfGrpcType } from "./protos/edf_service";
import { edfStreamService } from "./services/edfStreamService";
const edf_proto_path = path.resolve(__dirname, "protos/edf_service.proto");
const edf_proto_definition = loadSync(edf_proto_path, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const edf_proto = (grpc.loadPackageDefinition(edf_proto_definition) as unknown) as EdfGrpcType;
grpcServer.addService(edf_proto.edf_service.EdfService.service, edfStreamService);

// Reflection Service
const reflectionService = new ReflectionService(edf_proto_definition);
reflectionService.addToServer(grpcServer);

// Start gRPC Server
const grpcPort: number = Number(process.env.GRPC_PORT) || 50051;
grpcServer.bindAsync(
  `0.0.0.0:${grpcPort}`,
  grpc.ServerCredentials.createInsecure(),
  (error: Error | null, port: number) => {
    if (error) {
      console.error("Error starting gRPC server:", error);
    } else {
      console.log(`gRPC server started on port ${port}`);
    };
  },
);