
declare type IApiResponse<T> = IErrorResponse | ISuccessResponse<T>

declare interface IErrorResponse {
  status: false;
  code: number;
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>
}

declare interface ISuccessResponse<T> {
  status: true;
  code: number;
  message?: string;
  payload?: T
}