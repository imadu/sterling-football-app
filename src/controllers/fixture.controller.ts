import { Request, Response } from "express";
import FixturesService from "../services/fixturesService";
import Handler from "../utils/response.handlers";
import HttpStauts from "http-status-codes";
import { FixtureDTO } from "../services/dtos/index.dto";

export default class FixtureController {
  _fixtureService: FixturesService;
  _responseHandler: Handler;

  constructor(fixtureService: FixturesService, responseHandler: Handler) {
    this._fixtureService = fixtureService;
    this._responseHandler = responseHandler;
    this.Create = this.Create.bind(this);
    this.DeleteFixture = this.DeleteFixture.bind(this);
    this.FindAll = this.FindAll.bind(this);
    this.FindOne = this.FindOne.bind(this);
    this.UpdateFixture = this.UpdateFixture.bind(this);
    this.FindOnStatus = this.FindOnStatus.bind(this);
    this.FindOnQuery = this.FindOnQuery.bind(this);
    this.GenerateLink = this.GenerateLink.bind(this);
  }

  async FindAll(req: Request, res: Response): Promise<Response<any>> {
    const query = req.query;
    try {
      const data = await this._fixtureService.FindAllTodayFixtures(query);
      return this._responseHandler.success(res, HttpStauts.OK, data);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStauts.NOT_FOUND,
        error,
        "could not find fixtures for today",
        "404"
      );
    }
  }

  async GenerateLink(req: Request, res: Response): Promise<Response<any>> {
    const { id } = req.params;
    try {
      const link = await this._fixtureService.GenrateFixtureLink(id);
      return this._responseHandler.success(res, HttpStauts.CREATED, link);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStauts.EXPECTATION_FAILED,
        error,
        "could not create unique link",
        "417"
      );
    }
  }

  async FindOne(req: Request, res: Response): Promise<Response<any>> {
    const { id } = req.params;
    try {
      const fixture = await this._fixtureService.FindByID(id);
      return this._responseHandler.success(res, HttpStauts.OK, fixture);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStauts.NOT_FOUND,
        error,
        "could not find fixture",
        "404"
      );
    }
  }

  async FindOnStatus(req: Request, res: Response): Promise<Response<any>> {
    const date: any = req.query.date;
    const status: any = req.query.status;
    try {
      const fixture = await this._fixtureService.FindFixturesOnStatus(
        date,
        status
      );
      return this._responseHandler.success(res, HttpStauts.OK, fixture);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStauts.NOT_FOUND,
        error,
        "could not find fixture",
        "404"
      );
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
      const data = await this._fixtureService.FindFixture(queryObject);
      return this._responseHandler.success(res, HttpStauts.OK, data);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStauts.BAD_REQUEST,
        error,
        "something went wrong",
        "400"
      );
    }
  }

  async Create(req: Request, res: Response): Promise<Response<any>> {
    const body: FixtureDTO = req.body;
    try {
      const fixture = await this._fixtureService.Create(body);
      return this._responseHandler.success(res, HttpStauts.CREATED, fixture);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStauts.INTERNAL_SERVER_ERROR,
        error,
        "something went wrong",
        "500"
      );
    }
  }

  async UpdateFixture(req: Request, res: Response): Promise<Response<any>> {
    const body: FixtureDTO = req.body;
    const { id } = req.params;
    try {
      const updateFixture = await this._fixtureService.Update(id, body);
      return this._responseHandler.success(res, HttpStauts.OK, updateFixture);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStauts.BAD_REQUEST,
        error,
        "something went wrong",
        "400"
      );
    }
  }

  async DeleteFixture(req: Request, res: Response): Promise<Response<any>> {
    const { id } = req.params;
    try {
      const deleted = await this._fixtureService.DeleteFixture(id);
      return this._responseHandler.success(res, HttpStauts.OK, deleted._id);
    } catch (error) {
      return this._responseHandler.error(
        res,
        HttpStauts.INTERNAL_SERVER_ERROR,
        error,
        "something went wrong",
        "500"
      );
    }
  }
}
