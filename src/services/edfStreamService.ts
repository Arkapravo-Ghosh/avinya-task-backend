import * as grpc from "@grpc/grpc-js";
import { EdfServiceHandlers } from "../protos/edf_service/EdfService";
import { EdfRequest } from "../protos/edf_service/EdfRequest";
import { EdfData } from "../protos/edf_service/EdfData";
import path from "path";
import fs from "fs";
import edf from "edf-parser";

interface Data {
  count: number,
  start: string,
  duration: number,
  samples: number[],
};

export const edfStreamService: EdfServiceHandlers = {
  StreamEdfData: (call: grpc.ServerWritableStream<EdfRequest, EdfData>) => {
    const edf_filepath = path.resolve(__dirname, "../assets/edf/data1.edf");

    const reader = fs.createReadStream(edf_filepath);

    const records = edf(reader);

    reader.on("error", (error) => {
      console.log(`Reader Error: ${error}`)
    });

    records.on("error", (error: Error) => {
      console.log(`Records Error: ${error}`)
    });

    records.on("data", (record: edf.Record) => {
      const data: Data = {
        count: record.count,
        start: record.start.toISOString(),
        duration: record.duration,
        samples: record.samples,
      };
      const edfData: EdfData = { data: JSON.stringify(data) };
      call.write(edfData);
    });

    call.on("cancelled", () => {
      console.log("Call Cancelled");
      records.destroy();
      return call.end();
    });

    reader.on("end", () => {
      return call.end();
    });
  },
};
