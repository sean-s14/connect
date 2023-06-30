export type Gender = "male" | "female";
export const GENDERS: Gender[] = ["male", "female"];

export type UserFields =
  | "name"
  | "username"
  | "email"
  | "password"
  | "profileImage"
  | "dateOfBirth"
  | "gender"
  | "bio"
  | "private"
  | "createdAt"
  | "updatedAt";

export interface IUser {
  name: string;
  username: string;
  email: string;
  password?: string;
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  bio?: string;
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
}
