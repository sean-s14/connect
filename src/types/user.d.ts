import { Types } from "mongoose";

export type UserFields =
  | "_id"
  | "name"
  | "username"
  | "email"
  | "password"
  | "image"
  | "dateOfBirth"
  | "gender"
  | "bio"
  | "private"
  | "createdAt"
  | "updatedAt";

export interface IUser {
  _id?: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  image?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  bio?: string;
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
}
