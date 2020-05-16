import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { IUser } from "../types/user";

export const UserSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: String,
  username: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["regular", "admin"], default: "regular" },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre<IUser>("save", async function (next: mongoose.HookNextFunction) {
  const user = this;
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (error) {
    return next(error);
  }
});
