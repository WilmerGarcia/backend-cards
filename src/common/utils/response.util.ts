import { ResponseStatus } from '../enum/response-status.enum';
import { Response } from '../interface/response.interface';

export function createResponse<T>(
  status: ResponseStatus,
  message: string,
  data?: T,
): Response<T> {
  return {
    status,
    message,
    data,
  };
}
