import { Document } from "mongoose";

interface Player {
  name: string;
  age: number;
  position: string;
}

export interface ITeam extends Document {
  name: string;
  stadium: string;
  players: [Player];
}
