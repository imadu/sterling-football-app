import { FixturesSchema } from "../models/fixtures.schema";
import mongoose from "mongoose";
import { IFixture } from "../types/fixtures";
import { FixtureDTO } from "./dtos/index.dto";

export default class FixturesService {
  private fixtureModel = mongoose.model<IFixture>("fixtures", FixturesSchema);
  constructor() {}

  HandleError(error: any) {
    return error;
  }

  async FindAllTodayFixtures(query: any): Promise<IFixture[]> {
    const limit: number = query.limit ? parseInt(query.limit, 10) : 10;
    const page: number = query.page ? parseInt(query.page, 10) : 1;
    delete query.limit;
    delete query.page;
    try {
      return await this.fixtureModel
        .find({ ...query })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
    } catch (error) {
      this.HandleError(error);
    }
  }

  async GenrateFixtureLink(id: string): Promise<string> {
    try {
      const fixture = await this.FindByID(id);
      if (fixture) {
        return `${process.env.HOST}/fixtures/${fixture._id}`;
      }
      return this.HandleError("fixture not found");
    } catch (error) {
      this.HandleError(error);
    }
  }

  async FindFixturesOnStatus(
    date: string,
    status: string
  ): Promise<IFixture[]> {
    try {
      const fixtures = await this.fixtureModel.find({
        $and: [{ fixtureDate: new Date(date) }, { status }],
      });
      return fixtures;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async FindByID(id: string): Promise<IFixture> {
    try {
      return await this.fixtureModel.findOne({ _id: id });
    } catch (error) {
      this.HandleError(error);
    }
  }

  async FindFixture(query: any): Promise<IFixture[]> {
    try {
      const Fixture = await this.fixtureModel.find({ ...query });
      return Fixture;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async Create(fixture: FixtureDTO): Promise<IFixture> {
    try {
      const newFixture = new this.fixtureModel(fixture);
      return await newFixture.save();
    } catch (error) {
      this.HandleError(error);
    }
  }

  async Update(id: string, fixture: FixtureDTO): Promise<IFixture> {
    try {
      const updatedFixture = await this.fixtureModel.findByIdAndUpdate(
        { _id: id },
        { $set: fixture as IFixture },
        { new: true }
      );
      return updatedFixture;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async DeleteFixture(id: string): Promise<IFixture> {
    try {
      return this.fixtureModel.findByIdAndDelete({ _id: id });
    } catch (error) {
      this.HandleError(error);
    }
  }
}
