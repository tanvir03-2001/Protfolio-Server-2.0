import mongoose from "mongoose";

const globalCache = globalThis;

let cached = globalCache.mongoose;

if (!cached) {
  cached = globalCache.mongoose = { conn: null, promise: null };
}

export async function connectDB(uri) {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.set("strictQuery", true);
    cached.promise = mongoose.connect(uri).then((connection) => {
      console.log("MongoDB connected");
      return connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
