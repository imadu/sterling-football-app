import { Document } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  createdAt: Date;
  password: string;
  username: string;
  role: string;
}
