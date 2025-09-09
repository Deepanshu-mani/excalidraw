import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from project root
config({ path: resolve(process.cwd(), "../../.env") });

import express from "express";
import mainRouter from "./routes/index.js";
import { PORT, DATABASE_URL, validateConfig, config as appConfig } from "@repo/backend-common/config";
import cors from "cors";
import { prismaClient } from "@repo/db/client";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1", mainRouter);

async function main() {
  try {
    // Validate configuration
    validateConfig();
    console.log("✅ Configuration validated successfully");
    
    // Test the database connection
    await prismaClient.$connect();
    console.log("✅ PostgreSQL DB connection successful");

    app.listen(PORT, () => {
      console.log(`🚀 HTTP Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${appConfig.app.nodeEnv}`);
      console.log(`🔗 CORS Origin: ${appConfig.app.corsOrigin}`);
    });
  } catch (e) {
    console.error("❌ Error starting server:", e);
    process.exit(1);
  }
}

main();

app.get("/", (req, res) => {
  res.send("Server is up and Running");
});
