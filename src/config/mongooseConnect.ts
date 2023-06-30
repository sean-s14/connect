import mongoose, { ConnectOptions } from "mongoose";

const URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function mongooseConnect() {
  if (!URI) {
    throw new Error(
      "Please define the URI environment variable inside .env.local"
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(URI, {
        bufferCommands: false, // useCreateIndex:true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions)
      .then((mongoose) => {
        console.log("Connected to MongoDB");
        return mongoose;
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
