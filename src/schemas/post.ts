import { Schema, model, models } from "mongoose";
import { IPost } from "@/constants/schemas/post";

mongoose.Promise = global.Promise;

const postSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
  updatedAt: { type: Date, default: () => Date.now() },
  deletedAt: Date,
  isDeleted: { type: Boolean, default: false },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  parent: { type: Schema.Types.ObjectId, ref: "Post" },
  children: [{ type: Schema.Types.ObjectId, ref: "Post" }], // replies
});

const Post = models.Post || model<IPost>("Post", postSchema);

export default Post;
