import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import defaultPortfolio from "./data/default-portfolio.json" with { type: "json" };
import { Admin } from "./models/Admin.js";
import { Portfolio } from "./models/Portfolio.js";

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await connectDB(process.env.MONGODB_URI);

  const existingPortfolio = await Portfolio.findOne({ key: "main" });
  if (!existingPortfolio) {
    await Portfolio.create({ key: "main", ...defaultPortfolio });
    console.log("Portfolio content seeded to MongoDB");
  } else {
    console.log("Portfolio content already exists");
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ email, passwordHash });
    console.log(`Admin created: ${email}`);
  } else {
    console.log("Admin already exists");
  }

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
