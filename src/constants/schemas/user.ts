import { Types } from "mongoose";
export type Gender = "male" | "female";
export const GENDERS: Gender[] = ["male", "female"];

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
  | "updatedAt"
  | "posts";

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
  posts?: Types.ObjectId[];
}
