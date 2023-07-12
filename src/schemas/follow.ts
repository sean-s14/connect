import { Schema, model, models } from "mongoose";
import { IFollow } from "@/types/follow";

mongoose.Promise = global.Promise;

const followSchema = new Schema<IFollow>({
  follower: { type: Schema.Types.ObjectId, ref: "User", required: true },
  following: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, immutable: true, default: () => Date.now() },
});

const Follow = models.Follow || model<IFollow>("Follow", followSchema);

export default Follow;
