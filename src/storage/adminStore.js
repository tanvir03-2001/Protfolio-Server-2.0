import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";

export async function ensureAdminSeed() {
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
  }
}

export async function verifyAdmin(email, password) {
  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  return valid ? { email: admin.email } : null;
}
