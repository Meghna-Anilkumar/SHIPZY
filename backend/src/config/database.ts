import mongoose from "mongoose";

export const connectDatabase = async (mongoUri: string): Promise<void> => {
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || "food_delivery_app"
  });
};
