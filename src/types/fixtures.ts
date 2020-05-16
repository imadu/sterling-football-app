import { Document } from "mongoose";

export interface Official {
  name: string;
  position: string;
}

export interface IFixture extends Document {
  fixtureDate: Date;
  homeTeam: string;
  awayTeam: string;
  stadium: string;
  capacity: number;
  kickOffTime: Date;
  matchOfficials: [Official];
}
