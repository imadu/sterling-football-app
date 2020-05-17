import * as jwt from "jsonwebtoken";

export default class JWT {
  constructor() {}

  public Create(payload: any, long: boolean): string {
    let token: string;
    if (long === true) {
      token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: process.env.LONG_TIME,
      });
      return token;
    }

    token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: process.env.SHORT_TIME,
    });
    return token;
  }
}
