import { FixturesSchema } from "../models/fixtures.schema";
import mongoose from "mongoose";
import { IFixture } from "../types/fixtures";
import { FixtureDTO } from "./dtos/index.dto";

export default class FixturesService {
  private fixtureModel = mongoose.model<IFixture>("fixtures", FixturesSchema);
  constructor() {}

  HandleError(error: any) {
    throw new Error(error);
  }

  async FindAllTodayFixtures(date: Date): Promise<IFixture[]> {
    try {
      return await this.fixtureModel.find({ fixtureDate: date });
    } catch (error) {
      this.HandleError(error);
    }
  }

  async FindFixturesOnStatus(date: Date, status: string): Promise<IFixture[]> {
    try {
      const fixtures = await this.fixtureModel.find({
        $and: [{ fixtureDate: date }, { status }],
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

  async FindFixture(query: any): Promise<IFixture> {
    try {
      const Fixture = await this.fixtureModel.findOne({ ...query });
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
      const updatedFixture = await this.fixtureModel.findOneAndUpdate(
        { _id: id },
        { $set: fixture },
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
