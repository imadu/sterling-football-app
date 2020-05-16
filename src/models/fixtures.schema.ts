import * as mongoose from "mongoose";

export const FixturesSchema = new mongoose.Schema({
  fixtureDate: { type: Date, default: Date.now },
  homeTeam: String,
  awayTeam: String,
  stadium: String,
  capacity: Number,
  kickOffTime: { type: Date },
  matchOfficials: [{ name: String, position: String }],
});
