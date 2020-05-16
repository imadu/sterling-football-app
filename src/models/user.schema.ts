import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import {User} from '../types/user'

export const UserSchema  = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    username: String,
    password: String,
    role: {type: String, enum: ['regular', 'admin'], default: 'regular' },
    createdAt: {type: Date, default: Date.now}
})

UserSchema.pre<User>('save', async function(next: mongoose.HookNextFunction){
    const user = this;
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (error) {
    return next(error);
  }

})