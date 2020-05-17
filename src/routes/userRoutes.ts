import { Router } from "express";
import AuthService from "../auth/auth";
import UserController from '../controllers/user.controller'

export default class UserRoute {
  private router: Router = Router();
  private AuthService: AuthService = new AuthService();
  private UserController: UserController = new UserController();
  constructor() {}

  



}
