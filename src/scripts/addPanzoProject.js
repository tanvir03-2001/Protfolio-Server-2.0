import "dotenv/config";
import { connectDB } from "../config/db.js";
import defaultPortfolio from "../data/default-portfolio.json" with { type: "json" };
import { Portfolio } from "../models/Portfolio.js";

const PANZO_SLUG = "panzo-ecommerce-full-stack-platform";

async function addPanzoProject() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await connectDB(process.env.MONGODB_URI);

  const panzoProject = defaultPortfolio.site.projects.find(
    (project) => project.slug === PANZO_SLUG,
  );

  if (!panzoProject) {
    throw new Error(`Panzo project not found in default-portfolio.json (${PANZO_SLUG})`);
  }

  const portfolio = await Portfolio.findOne({ key: "main" });

  if (!portfolio) {
    await Portfolio.create({ key: "main", ...defaultPortfolio });
    console.log("Portfolio created with Panzo project");
    process.exit(0);
  }

  const existingIndex = portfolio.site.projects.findIndex(
    (project) => project.slug === PANZO_SLUG,
  );

  if (existingIndex === -1) {
    const splasbdIndex = portfolio.site.projects.findIndex(
      (project) => project.slug === "splasbd-full-stack-e-commerce-platform",
    );
    const insertAt = splasbdIndex === -1 ? portfolio.site.projects.length : splasbdIndex + 1;
    portfolio.site.projects.splice(insertAt, 0, panzoProject);
    console.log("Panzo project added to portfolio");
  } else {
    portfolio.site.projects[existingIndex] = panzoProject;
    console.log("Panzo project updated in portfolio");
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

addPanzoProject().catch((error) => {
  console.error(error);
  process.exit(1);
});
