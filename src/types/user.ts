import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  password: string;
  username: string;
  role: string;
}
