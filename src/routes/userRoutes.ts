import { Router } from "express";
import AuthService from "../auth/auth";

export default class UserRoute {
  private router: Router = Router();
  private AuthService: AuthService = new AuthService();
  constructor() {}



}
