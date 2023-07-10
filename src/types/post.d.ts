import { Types } from "mongoose";

export type PostFields =
  | "author"
  | "content"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "isDeleted"
  | "likes"
  | "liked"
  | "likeCount"
  | "parent"
  | "children"
  | "replies"
  | "replyCount";

export interface IPost {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  isDeleted?: boolean;
  likes?: Types.ObjectId[];
  liked?: boolean;
  likeCount?: number;
  parent?: Types.ObjectId;
  children?: Types.ObjectId[];
  replies?: IPostWithoutLists[];
  replyCount?: number;
}

export interface IPostAuthor {
  _id: string;
  name: string;
  username: string;
  image: string;
}

export interface IPostWithAuthor extends Omit<IPost, "author"> {
  author: IPostAuthor;
}

export interface IPostWithAuthorAndParent
  extends Omit<IPostWithAuthor, "parent"> {
  parent?: IPostWithAuthor;
}
