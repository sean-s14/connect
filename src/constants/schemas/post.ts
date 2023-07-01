import { Types } from "mongoose";

export type PostFields =
  | "author"
  | "content"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "isDeleted"
  | "likes"
  | "parent"
  | "children";

export interface IPost {
  author: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isDeleted?: boolean;
  likes?: Types.ObjectId[];
  parent?: Types.ObjectId;
  children?: Types.ObjectId[];
}
