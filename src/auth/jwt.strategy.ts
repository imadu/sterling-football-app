import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserService from "../services/userService";
import Handler from "../utils/response.handlers";
import HttpStatus from "http-status-codes";
import { TokenInterface, AdminPayload } from "../types/jwt";

export default class JWT {
  _userService: UserService;
  _responseHandler: Handler;
  constructor(userService: UserService, responseHandler: Handler) {
    this._userService = userService;
    this._responseHandler = responseHandler;
    this.checkToken = this.checkToken.bind(this);
    this.isAdmin = this.isAdmin.bind(this);
  }

  public Create(payload: any, long: boolean): string {
    let token: string;
    if (long === true) {
      token = jwt.sign(payload, process.env.SECRET, {
        expiresIn: process.env.LONG_TIME,
      });
      return `Bearer ${token}`;
    }
    token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: process.env.SHORT_TIME,
    });
    return `Bearer ${token}`;
  }

  public async checkToken(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization.split(" ")[1],
      decoded;
    if (!token) {
      return this._responseHandler.error(
        res,
        HttpStatus.UNAUTHORIZED,
        token,
        "unauthorized",
        "403"
      );
    }
    if (typeof token === "undefined") {
      return this._responseHandler.error(
        res,
        HttpStatus.UNAUTHORIZED,
        token,
        "unauthorized",
        "403"
      );
    }

    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.UNAUTHORIZED,
        error,
        "unauthorized",
        "403"
      );
    }
    let userToken = decoded as any;
    try {
      const user = await this._userService.FindByID(userToken.id);
      if (user) {
        next();
        return {
          status: "success",
          user,
        };
      }
      return this._responseHandler.error(
        res,
        HttpStatus.UNAUTHORIZED,
        userToken,
        "could not find user",
        "403"
      );
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return this._responseHandler.error(
          res,
          HttpStatus.UNAUTHORIZED,
          error,
          "token expired",
          "403"
        );
      }
      return this._responseHandler.error(
        res,
        HttpStatus.UNAUTHORIZED,
        error,
        "failed to authenicate token",
        "403"
      );
    }
  }

  public async isAdmin(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization.split(" ")[1],
      decoded;
    if (typeof token === "undefined") {
      return this._responseHandler.error(
        res,
        HttpStatus.UNAUTHORIZED,
        token,
        "unauthorized",
        "403"
      );
    }

    try {
      decoded = jwt.verify(token, process.env.SECRET);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.UNAUTHORIZED,
        error,
        "unauthorized",
        "403"
      );
    }
    let userToken = decoded as any;
    try {
      const adminUser = await this._userService.FindByID(userToken.id);
      if (adminUser.role === "admin") {
        return next();
      }
      return this._responseHandler.error(
        res,
        HttpStatus.UNAUTHORIZED,
        token,
        "user not authorized for this route",
        "401"
      );
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
        "something went wrong with the token",
        "500"
      );
    }
  }
}
