import { Request, Response } from "express";
import JWT from "./jwt.strategy";
import UserService from "../services/userService";
import { RegisterDTO } from "../services/dtos/index.dto";
import HttpStatus from "http-status-codes";
import Handler from "../utils/response.handlers";
import * as bcrypt from "bcrypt";

export default class AuthService {
  jwt: JWT;
  _userService: UserService;
  _responseHandler: Handler;

  constructor(jwt: JWT, userService: UserService, responseHandler: Handler) {
    this.jwt = jwt;
    this._userService = userService;
    this._responseHandler = responseHandler;
    this.signup = this.signup.bind(this)
    this.login = this.login.bind(this)
  }

  async signup(req: Request, res: Response): Promise<Response<any>> {
    const body: RegisterDTO = req.body;
    try {
      const data = await this._userService.Create(body);
      return this._responseHandler.success(res, HttpStatus.CREATED, data);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.BAD_REQUEST,
        error,
        "something went wrong",
        "400"
      );
    }
  }

  async login(req: Request, res: Response): Promise<Response<any>> {
    const { username, password } = req.body;
    try {
      const user = await this._userService.FindUser(username);
      if (!user) {
        return this._responseHandler.error(
          res,
          HttpStatus.NOT_FOUND,
          username,
          "username not found",
          "404"
        );
      }

      if (bcrypt.compareSync(password, user.password) !== true) {
        return this._responseHandler.error(
          res,
          HttpStatus.UNAUTHORIZED,
          username,
          "password incorrect",
          "401"
        );
      }
      const payload = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
      };
      const token = this.jwt.Create(payload, true);
      return this._responseHandler.success(res, HttpStatus.OK, token);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.BAD_REQUEST,
        error,
        "something went wrong",
        "400"
      );
    }
  }
}
