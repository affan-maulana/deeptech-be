import { HttpStatus } from "@nestjs/common";

export class ResponseDefaultDto<T> {
  statusCode: number;
  message: string;
  data: T | null;
  errors?: string[];
  timestamp: string;

  constructor(
    input: T | {
      statusCode?: number;
      message?: string;
      data?: T;      // konsisten pakai `data`, jangan `result`
      errors?: string[];
    },
  ) {
    if (input && typeof input === 'object' && !Array.isArray(input) && ('data' in input || 'statusCode' in input)) {
      this.statusCode = input.statusCode ?? HttpStatus.OK;
      this.message = input.message ?? 'Data retrieved successfully';
      this.data = (input.data ?? null) as T;
      this.errors = input.errors ?? undefined;
    } else {
      this.statusCode = HttpStatus.OK;
      this.message = 'Data retrieved successfully';
      this.data = input as T;
    }

    this.timestamp = new Date().toISOString();
  }
}
