import mongoose from "mongoose";
import { IUser } from "../types/user";
import { UserSchema } from "../models/user.schema";
import { RegisterDTO, UserDTO } from "./dtos/index.dto";

export default class userService {
  private userModel = mongoose.model<IUser>("User", UserSchema);
  constructor() {}

  private sanitizeUser(user: IUser) {
    const sanitized = user.toObject();
    delete sanitized.password;
    return sanitized;
  }

  public HandleError(error: string) {
    throw new Error(error);
  }

  async FindAll(): Promise<IUser[]> {
    try {
      return await this.userModel.find();
    } catch (error) {
      this.HandleError(error);
    }
  }

  async FindUser(username: string): Promise<IUser> {
    try {
      const result = await this.userModel.findOne({ username });
      return this.sanitizeUser(result);
    } catch (error) {
      this.HandleError(error);
    }
  }

  async DeleteUser(id: string): Promise<IUser> {
    try {
      return await this.userModel.findOneAndDelete({ _id: id });
    } catch (error) {
      this.HandleError(error);
    }
  }

  async Create(user: RegisterDTO): Promise<IUser> {
    try {
      const createdUser = new this.userModel(user);
      await createdUser.save();
      return this.sanitizeUser(createdUser);
    } catch (error) {
      this.HandleError(error);
    }
  }

  async Update(id: string, user: UserDTO): Promise<IUser> {
    try {
      return await this.userModel.findOneAndUpdate(
        { _id: id },
        { $set: user },
        { new: true }
      );
    } catch (error) {
        this.HandleError(error)
    }
  }
}
