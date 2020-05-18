import * as mongoose from "mongoose";

export const FixturesSchema = new mongoose.Schema({
  fixtureDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "ongoing", "terminated", "inprogress"],
    default: "pending",
  },
  score: { type: Number, default: 0 },
  homeTeam: String,
  awayTeam: String,
  stadium: String,
  capacity: Number,
  kickOffTime: { type: Date },
  matchOfficials: [{ name: String, position: String }],
  createdAt: {type: Date, default: Date.now}
});
