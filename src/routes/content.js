import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getPortfolioContent,
  updatePortfolioContent,
} from "../storage/portfolioStore.js";

const router = Router();

router.get("/", async (_req, res) => {
  const content = await getPortfolioContent();
  res.json(content);
});

router.put("/", requireAuth, async (req, res) => {
  const { profile, site } = req.body ?? {};

  if (!profile || !site) {
    return res.status(400).json({ message: "profile and site are required" });
  }

  const content = await updatePortfolioContent({ profile, site });
  res.json(content);
});

export default router;
