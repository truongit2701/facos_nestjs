interface Response {
  status?: number;
  message?: string;
  data?: any;
}

export class BaseResponse<T> {
  readonly status: number;
  readonly message: string;
  readonly data: T;

  constructor({ status, message, data }: Response) {
    this.status = status || 200;
    this.message = message || 'Success';
    this.data = data || null;
  }
}
