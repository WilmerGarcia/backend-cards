import { ResponseStatus } from '../enum/response-status.enum';
export interface Response<T> {
  status: ResponseStatus;
  message: string;
  data?: T;
}
