import { Schema, model, models } from "mongoose";
import { GENDERS } from "@/constants/schemas/user";
import { IUser } from "@/types/user";

mongoose.Promise = global.Promise;

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: String,
  image: String,
  dateOfBirth: Date,
  gender: { type: String, enum: GENDERS },
  bio: String,
  private: { type: Boolean, default: false },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
});

const User = models.User || model<IUser>("User", userSchema);

export default User;
