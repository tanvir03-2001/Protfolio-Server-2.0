const API = "http://localhost:5000";
const ADMIN_EMAIL = "admin@portfolio.local";
const ADMIN_PASSWORD = "admin123";

const SPLASBD_SLUG = "splasbd-full-stack-e-commerce-platform";

const enrichedProject = {
  slug: SPLASBD_SLUG,
  title: "SplasBD — Full-Stack E-commerce Platform",
  description:
    "A production-ready Bangladesh-focused B2C e-commerce platform with Next.js storefront, Express API, admin panel, COD checkout, Steadfast shipping, promo codes, reviews, and SEO.",
  fullDescription: `<h2>Overview</h2>
<p><strong>SplasBD</strong> is a Bangladesh-centric full-stack e-commerce monorepo (<code>client/</code> + <code>server/</code>) where customers browse products, manage cart, checkout as guest or registered users, and track orders — while admins run the entire store from a dedicated dashboard.</p>
<h2>Customer Storefront</h2>
<ul>
<li>Homepage with hero carousel, category showcase, promo sections, and trust blocks</li>
<li>Product listing with filters (category, price, brand, rating, gender, size, color), sort, and pagination</li>
<li>Product detail pages with image gallery, size/color selection, size chart, and verified reviews</li>
<li>Search with autocomplete and trending queries</li>
<li>localStorage cart with Bangladeshi address (division, district, upazila)</li>
<li>Guest and authenticated checkout with promo codes and shipping charge calculation (COD)</li>
<li>Order confirmation, guest order lookup, and account linking on login</li>
<li>Email/password auth, Google OAuth, email verification, and password reset</li>
<li>Dynamic sitemap, robots.txt, and SSR product metadata for SEO</li>
</ul>
<h2>Admin Panel</h2>
<ul>
<li>Real-time dashboard with order polling and revenue stats</li>
<li>Product CRUD with up to 30 Cloudinary images, sizes, colors, stock, and slugs</li>
<li>Category and subcategory management with homepage display order</li>
<li>Order management with status workflow and Steadfast courier shipment</li>
<li>User and role management, banners, promo codes, and promotional sections</li>
<li>Shipping settings, size charts (BD/UK/US), analytics, and site settings</li>
<li>CMS editors for Terms, Privacy, and About pages (TipTap rich text)</li>
</ul>
<h2>Backend &amp; Architecture</h2>
<ul>
<li>Express 5 + TypeScript with 17 feature-based modules (auth, products, orders, cart, promos, reviews, search…)</li>
<li>MongoDB + Mongoose ODM with JWT access/refresh tokens (HTTP-only cookies)</li>
<li>Cloudinary image uploads, Gmail SMTP emails, Steadfast/Packzy courier API + webhooks</li>
<li>Security: Helmet, CORS, bcrypt password hashing, role-based access control</li>
<li>Deployed on Vercel (client + serverless API); Render config available for alternative hosting</li>
</ul>`,
  details: [
    { label: "Role", value: "Full-Stack Developer" },
    { label: "Type", value: "Personal Project" },
    { label: "Market", value: "Bangladesh (BDT)" },
    { label: "Timeline", value: "2025 – 2026" },
    { label: "Frontend", value: "Next.js 16, React 19, Tailwind 4, shadcn/ui" },
    { label: "Backend", value: "Express 5, MongoDB, JWT, Cloudinary, Steadfast" },
  ],
  tags: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "Express",
    "MongoDB",
    "Mongoose",
    "JWT",
    "E-commerce",
    "Cloudinary",
    "Steadfast",
  ],
  links: [
    { label: "Live Store", href: "https://splasbd.com" },
    { label: "API", href: "https://splas-server.vercel.app" },
  ],
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

  const index = content.site.projects.findIndex((p) => p.slug === SPLASBD_SLUG);
  if (index === -1) throw new Error(`Project not found: ${SPLASBD_SLUG}`);

  const existing = content.site.projects[index];
  content.site.projects[index] = {
    ...enrichedProject,
    image: existing.image,
    images: existing.images,
  };

  content.site.about = [
    content.site.about[0],
    "I have delivered work such as the Luxxas E-commerce platform (frontend and backend) and SplasBD, a full-stack Bangladeshi e-commerce platform I built end to end. I am open to freelance, internships, and full-time opportunities where I can grow while shipping useful software.",
  ];

  content.site.aboutHighlights = content.site.aboutHighlights.map((item) =>
    item.title === "UI & Client Delivery"
      ? {
          ...item,
          tags: [...item.tags.filter((t) => t !== "SplasBD"), "Luxxas E-commerce", "SplasBD"],
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
  const project = updated.site.projects.find((p) => p.slug === SPLASBD_SLUG);
  console.log("SplasBD project updated successfully");
  console.log("- Title:", project.title);
  console.log("- Details:", project.details.length, "items");
  console.log("- Tags:", project.tags.length);
  console.log("- Links:", project.links.map((l) => l.href).join(", "));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
