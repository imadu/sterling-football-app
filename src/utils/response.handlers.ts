import { Response } from "express";

export default class Handler {
  constructor() {}
  public success(res: Response, statusCode: number, data: any): Response<any>{
    return res.status(statusCode).send({
      status: "success",
      data: data,
    });
  };

  public error (
      res: Response,
    statusCode: number,
    data: any,
    message: string,
    code: string
  ): Response<any> {
    return res.status(statusCode).send({
      status: "error",
      code: code,
      message: message,
      data: data,
    })
  };
}
