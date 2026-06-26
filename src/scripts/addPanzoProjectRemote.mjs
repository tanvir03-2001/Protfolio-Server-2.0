const API = "https://protfolio-server-2-0.vercel.app";
const ADMIN_EMAIL = "admin@portfolio.local";
const ADMIN_PASSWORD = "admin123";
const PANZO_SLUG = "panzo-ecommerce-full-stack-platform";
const SPLASBD_SLUG = "splasbd-full-stack-e-commerce-platform";

const panzoProject = {
  slug: PANZO_SLUG,
  title: "Panzo — Full-Stack Fashion E-commerce Platform",
  description:
    "A production-grade Bangladesh-focused fashion e-commerce ecosystem with Next.js storefront, Vite admin panel, Express API, RBAC, expense/investment tracking, custom recommendation engine, and analytics.",
  fullDescription: `<h2>Overview</h2>
<p><strong>Panzo Online Shopping</strong> (Tanvir E-commerce) is a production-grade, Bangladesh-focused fashion e-commerce ecosystem with three apps — <code>client/</code> (Next.js 16 storefront), <code>admin/</code> (Vite + React management panel), and <code>server/</code> (Express API) — sharing one REST backend and MongoDB.</p>
<h2>Architecture</h2>
<ul>
<li>Client (port 3000) and Admin (port 5173) both talk to Express API at <code>/api/v1</code></li>
<li>MongoDB for commerce data + separate activity-log database for audit trail</li>
<li>JWT access/refresh tokens in HTTP-only cookies; Passport Google &amp; Facebook OAuth</li>
<li>Cloudinary CDN for product media; Nodemailer for verification and password reset</li>
<li>Vercel-ready CORS for <code>.vercel.app</code> preview deployments</li>
</ul>
<h2>Client Storefront</h2>
<ul>
<li>Home carousel, category/brand browsing, product detail with color × size variants and Facebook Reel embed</li>
<li><code>ShopProvider</code> React Context — cart, wishlist, user, addresses with <code>localStorage</code> persistence</li>
<li>Bangladesh checkout: division → district → upazila cascade, Dhaka ৳60 / outside ৳120 shipping, BDT currency</li>
<li>Guest checkout, search with autocomplete, infinite scroll product lists</li>
<li>SEO: dynamic metadata, sitemap, robots, JSON-LD structured data</li>
<li>Client-side analytics tracking feeds the recommendation algorithm</li>
</ul>
<h2>Admin Panel</h2>
<ul>
<li>RBAC with 6+ roles (admin, moderator, super_user, reseller, product_manager, promoter)</li>
<li>Module permissions: dashboard, users, products, categories, brands, orders, banners, expenses, investments, analytics</li>
<li>Dashboard with revenue, stock, expense, and investment summaries + Recharts</li>
<li>Multi-variant product CRUD (color × size × stock × per-size pricing), Cloudinary uploads</li>
<li>Custom manual orders, expense distribution, promoter product views, jsPDF reports</li>
</ul>
<h2>Server &amp; Business Logic</h2>
<ul>
<li>14 feature modules: user, product, category, brand, banner, order, expense, investment, dashboard, permission, rbac, tracking, analytics, upload</li>
<li>Order lifecycle: pending → confirmed → processing → shipped → delivered / cancelled</li>
<li>COD + online payment enums; multi-variant product model with sourcing cost and specs</li>
<li>Custom recommendation engine — weighted scoring (interest 45%, popularity 20%, new 20%, random 15%) with 10-min cache</li>
<li>Security: Helmet, CORS, rate limiting, express-mongo-sanitize, Zod + express-validator</li>
</ul>
<h2>Outcomes</h2>
<ul>
<li>Complete SME e-commerce solution — storefront, operations, finance, and analytics in one stack</li>
<li>Bangladesh-ready UX: address hierarchy, COD-first checkout, BDT pricing</li>
<li>Enterprise admin with RBAC, expense/investment tracking, and behavior-based recommendations</li>
</ul>`,
  image: "",
  images: [],
  details: [
    { label: "Role", value: "Full-Stack Developer" },
    { label: "Type", value: "Personal Project" },
    { label: "Brand", value: "Panzo Online Shopping" },
    { label: "Market", value: "Bangladesh (BDT) — Panjabi & Fashion" },
    { label: "Timeline", value: "2025 – 2026" },
    { label: "Client", value: "Next.js 16, React 19, Tailwind 4, ShopProvider" },
    { label: "Admin", value: "Vite 7, React 19, Radix UI, Recharts" },
    { label: "Backend", value: "Express 4, MongoDB, JWT, Cloudinary, RBAC" },
  ],
  tags: [
    "Next.js",
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Express",
    "MongoDB",
    "Mongoose",
    "JWT",
    "E-commerce",
    "RBAC",
    "Cloudinary",
    "Recharts",
  ],
  links: [],
};

async function main() {
  const loginRes = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
  const { token } = await loginRes.json();

  const contentRes = await fetch(`${API}/api/content`);
  if (!contentRes.ok) throw new Error(`Fetch content failed: ${contentRes.status}`);
  const content = await contentRes.json();

  const existingIndex = content.site.projects.findIndex((p) => p.slug === PANZO_SLUG);
  if (existingIndex === -1) {
    const splasbdIndex = content.site.projects.findIndex((p) => p.slug === SPLASBD_SLUG);
    const insertAt = splasbdIndex === -1 ? content.site.projects.length : splasbdIndex + 1;
    content.site.projects.splice(insertAt, 0, panzoProject);
    console.log("Panzo project added");
  } else {
    content.site.projects[existingIndex] = {
      ...panzoProject,
      image: content.site.projects[existingIndex].image,
      images: content.site.projects[existingIndex].images,
    };
    console.log("Panzo project updated");
  }

  content.profile.stats = content.profile.stats.map((stat) =>
    stat.label === "projects" ? { ...stat, value: "5+" } : stat,
  );

  content.site.about = [
    content.site.about[0],
    "I have delivered work such as the Luxxas E-commerce platform (frontend and backend), SplasBD and Panzo — full-stack Bangladeshi fashion e-commerce platforms — and SchdoSocial, a Facebook Page post scheduling SaaS I built end to end. I am open to freelance, internships, and full-time opportunities where I can grow while shipping useful software.",
  ];

  content.site.aboutHighlights = content.site.aboutHighlights.map((item) =>
    item.title === "UI & Client Delivery"
      ? {
          ...item,
          tags: [...new Set([...item.tags, "Panzo"])],
        }
      : item,
  );

  const updateRes = await fetch(`${API}/api/content`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ profile: content.profile, site: content.site }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.text();
    throw new Error(`Update failed: ${updateRes.status} ${err}`);
  }

  const updated = await updateRes.json();
  console.log(`Total projects: ${updated.site.projects.length}`);
  console.log(
    "Slugs:",
    updated.site.projects.map((p) => p.slug).join(", "),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
