import defaultPortfolio from "../data/default-portfolio.json" with { type: "json" };
import { normalizeProfile, normalizeSite } from "../lib/projectNormalize.js";
import { Portfolio } from "../models/Portfolio.js";

export async function getPortfolioContent() {
  let portfolio = await Portfolio.findOne({ key: "main" }).lean();

  if (!portfolio) {
    portfolio = await Portfolio.create({ key: "main", ...defaultPortfolio });
    portfolio = portfolio.toObject();
  }

  return {
    profile: normalizeProfile(portfolio.profile),
    site: normalizeSite(portfolio.site),
    updatedAt: portfolio.updatedAt,
  };
}

export async function updatePortfolioContent({ profile, site }) {
  const normalizedProfile = normalizeProfile(profile);
  const normalizedSite = normalizeSite(site);

  const portfolio = await Portfolio.findOneAndUpdate(
    { key: "main" },
    { profile: normalizedProfile, site: normalizedSite },
    { new: true, upsert: true, runValidators: false },
  ).lean();

  return {
    profile: normalizeProfile(portfolio.profile),
    site: normalizeSite(portfolio.site),
    updatedAt: portfolio.updatedAt,
  };
}
