import { Request, Response } from "express";
import TeamService from "../services/teamsService";
import HttpStatus from "http-status-codes";
import { TeamDTO } from "../services/dtos/index.dto";
import Handler from "../utils/response.handlers";

export default class TeamController {
  _teamsService: TeamService;
  _responseHandler: Handler;

  constructor(teamService: TeamService, responseHandler: Handler) {
    this._responseHandler = responseHandler
    this._teamsService = teamService
    this.Create = this.Create.bind(this)
    this.DeleteTeam = this.DeleteTeam.bind(this)
    this.FindAll = this.FindAll.bind(this)
    this.FindOne = this.FindOne.bind(this)
    this.UpdateTeam = this.UpdateTeam.bind(this)
  }

  async FindAll(req: Request, res: Response): Promise<Response<any>> {
    const queryObject: any = {};
    const query = req.query;
    if (query.name) {
      // tslint:disable-next-line: no-string-literal
      queryObject["name"] = query.name;
    }
    if (query.stadium) {
      // tslint:disable-next-line: no-string-literal
      queryObject["stadium"] = query.stadium;
    }
    if (query.page) {
      // tslint:disable-next-line: no-string-literal
      queryObject["page"] = query.page;
    }
    if (query.limit) {
      // tslint:disable-next-line: no-string-literal
      queryObject["limit"] = query.limit;
    }

    try {
      const data = await this._teamsService.FindAllTeams(queryObject);
      return this._responseHandler.success(res, HttpStatus.OK, data);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.NOT_FOUND,
        error,
        "could not find teams",
        "404"
      );
    }
  }

  async FindOne(req: Request, res: Response): Promise<Response<any>> {
    const { name } = req.params;
    console.log(name);
    try {
      const team = await this._teamsService.FindTeam(name);
      return this._responseHandler.success(res, HttpStatus.OK, team);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.NOT_FOUND,
        error,
        "could not find team",
        "404"
      );
    }
  }

  async Create(req: Request, res: Response): Promise<Response<any>> {
    const body: TeamDTO = req.body;
    try {
      const newTeam = await this._teamsService.Create(body);
      return this._responseHandler.success(res, HttpStatus.CREATED, newTeam);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStatus.INTERNAL_SERVER_ERROR,
        error,
        "something went wrong",
        "500"
      );
    }
  }

  async UpdateTeam(req: Request, res: Response): Promise<Response<any>> {
    const { id } = req.params;
    const body: TeamDTO = req.body;
    try {
      const updatedTeam = await this._teamsService.UpdateTeam(id, body);
      return this._responseHandler.success(res, HttpStatus.OK, updatedTeam);
    } catch (error) {
      return this._responseHandler.error(res, HttpStatus.BAD_REQUEST, error, "could not update team", "400");
    }
  }

  async DeleteTeam(req: Request, res: Response): Promise<Response<any>> {
    const { id } = req.params;
    try {
      const deleted = await this._teamsService.Delete(id);
      return this._responseHandler.success(res, HttpStatus.OK, deleted);
    } catch (error) {
      return this._responseHandler.error(res, HttpStatus.INTERNAL_SERVER_ERROR, error, "something went wrong", "500");
    }
  }
}
