import mongoose from "mongoose";
import { env } from "@configs/env.config";

export async function connectToMongoose(): Promise<void> {
  const { DB_URL, DB_NAME } = env;

  if (mongoose.connection.readyState === mongoose.ConnectionStates.connected) {
    console.info("Mongoose is already established.");
    return;
  }

  try {
    await mongoose.connect(DB_URL, { dbName: DB_NAME });

    mongoose.connection.on("connected", () => {
      console.info(`Mongoose connected to ${DB_URL}/${DB_NAME}`);
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("Mongoose disconnected.");
    });

  } catch (error) {
    console.error("Failed to connect to Mongoose:", error);
    process.exit(1);
  }
}
