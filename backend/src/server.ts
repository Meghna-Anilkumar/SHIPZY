import dotenv from "dotenv";
import { createApp } from "./app";
import { connectDatabase } from "./config/database";
import { seedMenuIfEmpty } from "./config/seed-menu";

dotenv.config();

const port = Number(process.env.PORT || 4000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is required in environment variables");
}

const startServer = async () => {
  try {
    await connectDatabase(mongoUri);
    console.log("MongoDB connected");

    await seedMenuIfEmpty();

    const app = createApp();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect MongoDB:", error);
  }
};

void startServer();
