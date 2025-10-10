import mongoose from "mongoose";

// Read and normalize the URI
const MONGODB_URI_RAW = process.env.MONGODB_URI;
const MONGODB_DB = (process.env.MONGODB_DB || "khalil-studio").trim();
const MONGODB_URI = typeof MONGODB_URI_RAW === "string"
  ? MONGODB_URI_RAW.trim().replace(/^['"`](.*)['"`]$/, "$1")
  : MONGODB_URI_RAW;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI env var is required");
}

const hasValidMongoScheme = /^mongodb(\+srv)?:\/\//.test(MONGODB_URI);
if (!hasValidMongoScheme) {
  throw new Error(
    'MONGODB_URI must start with "mongodb://" or "mongodb+srv://". Example: mongodb://localhost:27017/your-db or mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/your-db'
  );
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

const globalWithMongoose = globalThis as unknown as { mongoose?: GlobalMongoose };
if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}
const cached: GlobalMongoose = globalWithMongoose.mongoose;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, {
        dbName: MONGODB_DB,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 30000,
        connectTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        retryReads: true,
        maxIdleTimeMS: 30000,
        bufferCommands: false, // ✅ keep this one only
      })
      .then((conn) => {
        console.log("✅ MongoDB connection successful");
        return conn;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
