import "dotenv/config";
import { connectDB } from "../config/db.js";
import defaultPortfolio from "../data/default-portfolio.json" with { type: "json" };
import { Portfolio } from "../models/Portfolio.js";

const SCHDOSOCIAL_SLUG = "schdosocial-facebook-post-scheduling-platform";

async function addSchdoSocialProject() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await connectDB(process.env.MONGODB_URI);

  const schdoSocialProject = defaultPortfolio.site.projects.find(
    (project) => project.slug === SCHDOSOCIAL_SLUG,
  );

  if (!schdoSocialProject) {
    throw new Error(
      `SchdoSocial project not found in default-portfolio.json (${SCHDOSOCIAL_SLUG})`,
    );
  }

  const portfolio = await Portfolio.findOne({ key: "main" });

  if (!portfolio) {
    await Portfolio.create({ key: "main", ...defaultPortfolio });
    console.log("Portfolio created with SchdoSocial project");
    process.exit(0);
  }

  const existingIndex = portfolio.site.projects.findIndex(
    (project) => project.slug === SCHDOSOCIAL_SLUG,
  );

  if (existingIndex === -1) {
    portfolio.site.projects.push(schdoSocialProject);
    console.log("SchdoSocial project added to portfolio");
  } else {
    portfolio.site.projects[existingIndex] = schdoSocialProject;
    console.log("SchdoSocial project updated in portfolio");
  }

  portfolio.profile.stats = defaultPortfolio.profile.stats;
  portfolio.site.about = defaultPortfolio.site.about;
  portfolio.site.aboutHighlights = defaultPortfolio.site.aboutHighlights;

  portfolio.markModified("profile");
  portfolio.markModified("site");
  await portfolio.save();

  console.log(`Total projects: ${portfolio.site.projects.length}`);
  process.exit(0);
}

addSchdoSocialProject().catch((error) => {
  console.error(error);
  process.exit(1);
});
