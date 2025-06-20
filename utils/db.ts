import mongoose from "mongoose";
import "@/models/UserModel";
import "@/models/House";
import "@/models/Subject";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface GlobalWithMongoose {
  __mongoose?: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

const globalWithMongoose = globalThis as GlobalWithMongoose;

const cached: {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
} = globalWithMongoose.__mongoose || { conn: null, promise: null };

if (!globalWithMongoose.__mongoose) globalWithMongoose.__mongoose = cached;

export default async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
