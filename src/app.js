import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import contentRoutes from "./routes/content.js";
import uploadRoutes from "./routes/upload.js";
import { ensureAdminSeed } from "./storage/adminStore.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

let initPromise = null;

async function ensureReady() {
  if (!initPromise) {
    initPromise = (async () => {
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required");
      }

      if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is required");
      }

      await connectDB(process.env.MONGODB_URI);
      await ensureAdminSeed();
    })();
  }

  return initPromise;
}

app.use(async (_req, _res, next) => {
  try {
    await ensureReady();
    next();
  } catch (error) {
    next(error);
  }
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, storage: "mongodb" });
});

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/upload", uploadRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    message: error instanceof Error ? error.message : "Internal server error",
  });
});

export default app;
