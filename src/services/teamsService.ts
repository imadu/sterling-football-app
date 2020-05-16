import { ITeam } from "../types/teams";
import { TeamsSchema } from "../models/teams.schema";
import mongoose from "mongoose";
import { TeamDTO } from "./dtos/index.dto";

export default class TeamService {
  private teamModel = mongoose.model<ITeam>("Team", TeamsSchema);

  constructor() {}

  HandleError(error: any) {
    throw new Error(error);
  }
  async FindAllTeams(query: any): Promise<ITeam[]> {
    const limit: number = query.limit ? parseInt(query.limit, 10) : 10;
    const page: number = query.page ? parseInt(query.page, 10) : 1;
    delete query.limit;
    delete query.page;

    try {
      const Teams = await this.teamModel
        .find({ ...query })
        .skip((page - 1) * limit)
        .limit(limit);
      return Teams;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async FindTeam(name: string): Promise<ITeam> {
    try {
      return await this.teamModel.findOne({ name });
    } catch (error) {
      this.HandleError(error);
    }
  }

  async Create(team: TeamDTO): Promise<ITeam> {
    try {
      const newTeam = new this.teamModel(team);
      await newTeam.save();
      return newTeam;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async UpdateTeam(id: string, team: TeamDTO): Promise<ITeam> {
    try {
      return await this.teamModel.findByIdAndUpdate(
        { _id: id },
        { $set: team },
        { new: true }
      );
    } catch (error) {
      this.HandleError(error);
    }
  }

  async Delete(id: string): Promise<ITeam> {
    try {
      return await this.teamModel.findByIdAndDelete({ _id: id });
    } catch (error) {
      this.HandleError(error);
    }
  }
}
