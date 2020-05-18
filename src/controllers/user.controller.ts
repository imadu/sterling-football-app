import { Request, Response } from "express";
import UserService from "../services/userService";
import HttpStatus from "http-status-codes";
import Handler from "../utils/response.handlers";
import { UserDTO, RegisterDTO } from "../services/dtos/index.dto";

export default class UserController {
  _userService: UserService;
  _responseHandler: Handler;

  constructor(userService: UserService, responseHandler: Handler) {
    this._userService = userService;
    this._responseHandler = responseHandler;
    this.Create = this.Create.bind(this);
    this.Delete = this.Delete.bind(this);
    this.FindOne = this.FindOne.bind(this);
    this.Get = this.Get.bind(this);
    this.UpdateOne = this.UpdateOne.bind(this);
  }

  async Get(req: Request, res: Response): Promise<Response<any>> {
    try {
      const data = await this._userService.FindAll();
      return this._responseHandler.success(res, HttpStatus.OK, data);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.NOT_FOUND,
        error,
        "could not get users",
        "404"
      );
    }
  }
  async FindOne(req: Request, res: Response): Promise<Response<any>> {
    try {
      const { id } = req.params;
      const user = await this._userService.FindByID(id);
      return this._responseHandler.success(res, HttpStatus.OK, user);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.NOT_FOUND,
        error,
        "could not find user",
        "404"
      );
    }
  }

  async UpdateOne(req: Request, res: Response): Promise<Response<any>> {
    const body: UserDTO = req.body;
    const { id } = req.params;
    try {
      const updated = await this._userService.Update(id, body);
      return this._responseHandler.success(res, HttpStatus.OK, updated);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.BAD_REQUEST,
        error,
        "could not update user",
        "400"
      );
    }
  }

  async Create(req: Request, res: Response): Promise<Response<any>> {
    const body: RegisterDTO = req.body;
    try {
      const data = await this._userService.Create(body);
      return this._responseHandler.success(res, HttpStatus.CREATED, data);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
        "could not create user",
        "500"
      );
    }
  }

  async Delete(req: Request, res: Response): Promise<Response<any>> {
    const { id } = req.params;
    try {
      const data = await this._userService.DeleteUser(id);
      return this._responseHandler.success(res, HttpStatus.OK, data);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
        "could not delete user",
        "500"
      );
    }
  }
}
