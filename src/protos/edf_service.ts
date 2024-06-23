import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { EdfServiceClient as _edf_service_EdfServiceClient, EdfServiceDefinition as _edf_service_EdfServiceDefinition } from './edf_service/EdfService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  edf_service: {
    EdfData: MessageTypeDefinition
    EdfRequest: MessageTypeDefinition
    EdfService: SubtypeConstructor<typeof grpc.Client, _edf_service_EdfServiceClient> & { service: _edf_service_EdfServiceDefinition }
  }
}

