export interface StandardResponse<T = null> {
    statusCode: number;
    message: string;
    data?: T;
  }
  