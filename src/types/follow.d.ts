import { Types } from "mongoose";

export interface IFollow {
  following: Types.ObjectId; // User who is being followed
  follower: Types.ObjectId; // User who is following
  createdAt?: Date;
}

export interface IFollowResponse {
  followerCount: number;
  followingCount: number;
  following: boolean;
}
