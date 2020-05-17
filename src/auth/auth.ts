import { Request, Response } from "express";
import JWT from "./jwt.strategy";
import UserService from "../services/userService";
import { RegisterDTO } from "../services/dtos/index.dto";
import HttpStatus from "http-status-codes";
import Handler from "../utils/response.handlers";
import * as bcrypt from "bcrypt";

export default class AuthService {
  private jwt: JWT = new JWT();
  private userService = new UserService();
  private Handlers = new Handler();

  async signup(req: Request, res: Response): Promise<Response<any>> {
    const body: RegisterDTO = req.body;
    try {
      const data = await this.userService.Create(body);
      return res.status(HttpStatus.CREATED).send(this.Handlers.success(data));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(this.Handlers.error(error, "something went wrong", "400"));
    }
  }

  async login(req: Request, res: Response): Promise<Response<any>> {
    const { username, password } = req.body;
    try {
      const user = await this.userService.FindUser(username);
      if (!user) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send(this.Handlers.error(username, "username not found", "404"));
      }

      if (bcrypt.compareSync(password, user.password) !== true) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send(this.Handlers.error(username, "password incorrect", "401"));
      }
      const payload = {
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      };
      const token = this.jwt.Create(payload, true);
      return res.status(HttpStatus.OK).send(this.Handlers.success(token));
    } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).send(this.Handlers.error(error, 'something went wrong', '400'))
    }
  }
}
