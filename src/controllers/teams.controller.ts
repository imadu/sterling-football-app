import { Request, Response } from "express";
import TeamService from "../services/teamsService";
import HttpStatus from "http-status-codes";
import { TeamDTO } from "../services/dtos/index.dto";
import Handler from "../utils/response.handlers";

export default class TeamController {
  private TeamsService: TeamService = new TeamService();
  private Handler = new Handler();

  constructor() {}

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
      queryObject["stadium"] = query.limit;
    }

    try {
      const data = await this.TeamsService.FindAllTeams(queryObject);
      return res.status(HttpStatus.OK).send(this.Handler.success(data));
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send(this.Handler.error(error, "could not find the teams", "404"));
    }
  }

  async FindOne(req: Request, res: Response): Promise<Response<any>> {
    const { name } = req.params;
    try {
      const team = await this.TeamsService.FindTeam(name);
      return res.status(HttpStatus.OK).send(this.Handler.success(team));
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send(this.Handler.error(error, "could not find team", "404"));
    }
  }

  async Create(req: Request, res: Response): Promise<Response<any>> {
    const body: TeamDTO = req.body;
    try {
      const newTeam = await this.TeamsService.Create(body);
      return res.status(HttpStatus.CREATED).send(this.Handler.success(newTeam));
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(this.Handler.error(error, "something went wrong", "500"));
    }
  }

  async UpdateTeam(req: Request, res: Response): Promise<Response<any>> {
    const { id } = req.params;
    const body: TeamDTO = req.body;
    try {
      const updatedTeam = await this.TeamsService.UpdateTeam(id, body);
      return res.status(HttpStatus.OK).send(this.Handler.success(updatedTeam));
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(this.Handler.error(error, "could not update the team", "400"));
    }
  }

  async DeleteTeam(req: Request, res: Response):Promise<Response<any>>{
      const {id} = req.params;
      try {
          const deleted = await this.TeamsService.Delete(id)
          return res.status(HttpStatus.OK).send(this.Handler.success(deleted));
      } catch (error) {
        return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(this.Handler.error(error, "could not delete the team", "500"));
          
      }
  }
}
