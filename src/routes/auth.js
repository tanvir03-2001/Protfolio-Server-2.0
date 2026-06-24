import { Router } from "express";
import jwt from "jsonwebtoken";
import { verifyAdmin } from "../storage/adminStore.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const admin = await verifyAdmin(email, password);
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({
    token,
    admin: { email: admin.email },
  });
});

export default router;
