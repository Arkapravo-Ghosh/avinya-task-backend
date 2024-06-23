// Original file: src/protos/edf_service.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EdfData as _edf_service_EdfData, EdfData__Output as _edf_service_EdfData__Output } from '../edf_service/EdfData';
import type { EdfRequest as _edf_service_EdfRequest, EdfRequest__Output as _edf_service_EdfRequest__Output } from '../edf_service/EdfRequest';

export interface EdfServiceClient extends grpc.Client {
  StreamEdfData(argument: _edf_service_EdfRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_edf_service_EdfData__Output>;
  StreamEdfData(argument: _edf_service_EdfRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_edf_service_EdfData__Output>;
  streamEdfData(argument: _edf_service_EdfRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_edf_service_EdfData__Output>;
  streamEdfData(argument: _edf_service_EdfRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_edf_service_EdfData__Output>;
  
}

export interface EdfServiceHandlers extends grpc.UntypedServiceImplementation {
  StreamEdfData: grpc.handleServerStreamingCall<_edf_service_EdfRequest__Output, _edf_service_EdfData>;
  
}

export interface EdfServiceDefinition extends grpc.ServiceDefinition {
  StreamEdfData: MethodDefinition<_edf_service_EdfRequest, _edf_service_EdfData, _edf_service_EdfRequest__Output, _edf_service_EdfData__Output>
}
