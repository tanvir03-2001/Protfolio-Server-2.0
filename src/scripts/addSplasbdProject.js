import "dotenv/config";
import { connectDB } from "../config/db.js";
import defaultPortfolio from "../data/default-portfolio.json" with { type: "json" };
import { Portfolio } from "../models/Portfolio.js";

const SPLASBD_SLUG = "splasbd-full-stack-e-commerce-platform";

async function addSplasbdProject() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await connectDB(process.env.MONGODB_URI);

  const splasbdProject = defaultPortfolio.site.projects.find(
    (project) => project.slug === SPLASBD_SLUG,
  );

  if (!splasbdProject) {
    throw new Error(`SplasBD project not found in default-portfolio.json (${SPLASBD_SLUG})`);
  }

  const portfolio = await Portfolio.findOne({ key: "main" });

  if (!portfolio) {
    await Portfolio.create({ key: "main", ...defaultPortfolio });
    console.log("Portfolio created with SplasBD project");
    process.exit(0);
  }

  const hasSplasbd = portfolio.site.projects.some(
    (project) => project.slug === SPLASBD_SLUG,
  );

  if (!hasSplasbd) {
    portfolio.site.projects.push(splasbdProject);
    console.log("SplasBD project added to portfolio");
  } else {
    const index = portfolio.site.projects.findIndex(
      (project) => project.slug === SPLASBD_SLUG,
    );
    portfolio.site.projects[index] = splasbdProject;
    console.log("SplasBD project updated in portfolio");
  }

  portfolio.site.about = defaultPortfolio.site.about;
  portfolio.site.aboutHighlights = defaultPortfolio.site.aboutHighlights;

  portfolio.markModified("site");
  await portfolio.save();

  console.log(`Total projects: ${portfolio.site.projects.length}`);
  process.exit(0);
}

addSplasbdProject().catch((error) => {
  console.error(error);
  process.exit(1);
});
