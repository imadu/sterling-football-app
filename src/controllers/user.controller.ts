import { Request, Response } from "express";
import UserService from "../services/userService";
import HttpStatus from "http-status-codes";
import Handler from "../utils/response.handlers";
import { UserDTO, RegisterDTO } from "../services/dtos/index.dto";

export default class UserController {
  private UserService: UserService = new UserService();
  private Handler = new Handler();

  constructor() {}

  async Get(req: Request, res: Response): Promise<Response<any>> {
    try {
      const data = await this.UserService.FindAll();
      return res.status(HttpStatus.OK).send(this.Handler.success(data));
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send(this.Handler.error(error, "something went wrong", "404"));
    }
  }
  async FindOne(req: Request, res: Response): Promise<Response<any>> {
    try {
      const { username } = req.params;
      const user = await this.UserService.FindUser(username);
      return res.status(HttpStatus.OK).send(this.Handler.success(user));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(this.Handler.error(error, "something went wrong", "400"));
    }
  }

  async UpdateOne(req: Request, res: Response): Promise<Response<any>> {
      const body: UserDTO = req.body
      const {id} = req.params
    try {
        const updated = await this.UserService.Update(id, body)
        return res.status(HttpStatus.OK).send(this.Handler.success(updated))
    } catch (error) {
        return res
        .status(HttpStatus.BAD_REQUEST)
        .send(this.Handler.error(error, "something went wrong", "400"));
    }
  }

  async Create(req: Request, res: Response): Promise<Response<any>> {
      const body:RegisterDTO = req.body;
      try {
          const data = await this.UserService.Create(body)
          return res.status(HttpStatus.CREATED).send(this.Handler.success(data));
      } catch (error) {
        return res
        .status(HttpStatus.BAD_REQUEST)
        .send(this.Handler.error(error, "something went wrong", "400"));
      }
  }

  async Delete(req: Request, res: Response): Promise<Response<any>> {
    const { id } = req.params;
    try {
      const data = await this.UserService.DeleteUser(id);
      return res.status(HttpStatus.OK).send(this.Handler.success(data));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(this.Handler.error(error, "something went wrong", "500"));
    }
  }
}
