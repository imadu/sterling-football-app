import { Request, Response } from "express";
import FixturesService from "../services/fixturesService";
import Hander from "../utils/response.handlers";
import HttpStauts from "http-status-codes";
import { FixtureDTO } from "../services/dtos/index.dto";

export default class FixtureController {
  private FixtureService: FixturesService = new FixturesService();
  private Handler = new Hander();

  constructor() {}

  async FindAll(req: Request, res: Response): Promise<Response<any>> {
    const { date } = req.params;
    try {
      const data = await this.FixtureService.FindAllTodayFixtures(
        new Date(date)
      );
      return res.status(HttpStauts.OK).send(this.Handler.success(data));
    } catch (error) {
      return res
        .status(HttpStauts.NOT_FOUND)
        .send(
          this.Handler.error(
            error,
            "could not find any fixtures for today",
            "404"
          )
        );
    }
  }

  async FindOne(req: Request, res: Response): Promise<Response<any>> {
    const { id } = req.params;
    try {
      const fixture = await this.FixtureService.FindByID(id);
      return res.status(HttpStauts.OK).send(this.Handler.success(fixture));
    } catch (error) {
      return res
        .status(HttpStauts.NOT_FOUND)
        .send(this.Handler.error(error, "could not find fixture", "404"));
    }
  }

  async FindOnStatus(req: Request, res: Response): Promise<Response<any>> {
    const { date, status } = req.params;
    try {
      const fixture = await this.FixtureService.FindFixturesOnStatus(
        new Date(date),
        status
      );
      return res.status(HttpStauts.OK).send(this.Handler.success(fixture));
    } catch (error) {
      return res
        .status(HttpStauts.NOT_FOUND)
        .send(this.Handler.error(error, "could not find fixture", "404"));
    }
  }

  async FindOnQuery(req: Request, res: Response): Promise<Response<any>> {
    const queryObject: any = {};
    const query = req.query;
    if (query.fixtureDate) {
      // tslint:disable-next-line: no-string-literal
      queryObject["fixtureDate"] = query.fixtureDate;
    }
    if (query.page) {
      // tslint:disable-next-line: no-string-literal
      queryObject["page"] = query.page;
    }
    if (query.limit) {
      // tslint:disable-next-line: no-string-literal
      queryObject["limit"] = query.limit;
    }
    if (query.status) {
      // tslint:disable-next-line: no-string-literal
      queryObject["status"] = query.status;
    }

    try {
      const data = await this.FixtureService.FindFixture(queryObject);
      return res.status(HttpStauts.OK).send(this.Handler.success(data));
    } catch (error) {
      return res
        .status(HttpStauts.BAD_REQUEST)
        .send(this.Handler.error(error, "something went wrong", "400"));
    }
  }

  async Create(req: Request, res: Response): Promise<Response<any>> {
    const body: FixtureDTO = req.body;
    try {
      const fixture = await this.FixtureService.Create(body);
      return res.status(HttpStauts.CREATED).send(this.Handler.success(fixture));
    } catch (error) {
      return res
        .status(HttpStauts.INTERNAL_SERVER_ERROR)
        .send(this.Handler.error(error, "something went wrong", "500"));
    }
  }

  async UpdateFixture(req: Request, res: Response): Promise<Response<any>> {
    const body: FixtureDTO = req.body;
    const { id } = req.params;
    try {
      const updateFixture = await this.FixtureService.Update(id, body);
      return res
        .status(HttpStauts.OK)
        .send(this.Handler.success(updateFixture));
    } catch (error) {
      return res
        .status(HttpStauts.BAD_REQUEST)
        .send(this.Handler.error(error, "could not update the request", "400"));
    }
  }

  async DeleteFixture(req: Request, res: Response): Promise<Response<any>>{
      const {id} = req.params;
      try {
          const deleted = await this.FixtureService.DeleteFixture(id)
          return res.status(HttpStauts.OK).send(this.Handler.success(deleted))
      } catch (error) {
        return res
        .status(HttpStauts.BAD_REQUEST)
        .send(this.Handler.error(error, "could not update the request", "500"));
      }
  }
}
