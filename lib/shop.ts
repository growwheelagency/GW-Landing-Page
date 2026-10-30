// Lead shop: every service, the pieces inside it and their starting prices (INR).
// b: "mo" = billed monthly, "once" = one-time. Edit prices here only.
export type GroupId = "social" | "reach" | "web";
export type Billing = "mo" | "once";
export type Service = {
  id: string;
  g: GroupId;
  t: string;
  items: [name: string, price: number, b: Billing][];
};
export type Piece = {
  id: string;
  svc: Service;
  name: string;
  price: number;
  b: Billing;
};

export const groups: Record<GroupId, string> = {
  social: "Social",
  reach: "Ads & outreach",
  web: "Web",
};

export const services: Service[] = [
  {
    id: "igfb",
    g: "social",
    t: "Instagram & Facebook Account Management",
    items: [
      ["Profile setup, optimization and branding", 999, "once"],
      ["Content planning and monthly content calendar", 1499, "mo"],
      ["Content scheduling and publishing", 999, "mo"],
      ["Captions, hashtag research and content optimization", 799, "mo"],
      ["Content ideas based on industry trends", 499, "mo"],
      ["Social Media Optimization (SMO)", 999, "mo"],
      ["Monthly performance tracking and reporting", 499, "mo"],
    ],
  },
  {
    id: "content",
    g: "social",
    t: "Content Creation & Publishing",
    items: [
      ["Reels, posts, carousels and Stories", 2499, "mo"],
      ["Graphic design and promotional creatives", 1499, "mo"],
      ["Short-form and YouTube long video editing", 1999, "mo"],
    ],
  },
  {
    id: "meta",
    g: "social",
    t: "Meta Ads Management",
    items: [
      ["Facebook and Instagram campaign setup and management", 2999, "mo"],
      ["Audience research and targeting", 999, "once"],
      ["Ad creative and copy recommendations", 999, "mo"],
      ["Awareness, traffic, engagement and lead-generation campaigns", 1499, "mo"],
      ["Campaign monitoring, optimization and reporting", 999, "mo"],
    ],
  },
  {
    id: "organic",
    g: "social",
    t: "Organic Growth & Engagement",
    items: [
      ["Audience growth and engagement strategy", 1499, "mo"],
      ["Improving reach, saves, shares and profile visits", 999, "mo"],
      ["Competitor analysis and social media benchmarking", 1499, "once"],
      ["Content performance analysis and recommendations", 699, "mo"],
    ],
  },
  {
    // TODO: pieces drafted by Claude, confirm with the team
    id: "gads",
    g: "reach",
    t: "Google Ads Management (SEM)",
    items: [
      ["Search campaign setup and account structure", 1999, "once"],
      ["Keyword and negative keyword research", 999, "once"],
      ["Ad copy and extensions", 799, "mo"],
      ["Bid and budget management", 2499, "mo"],
      ["Conversion tracking setup", 999, "once"],
      ["Monthly performance reporting", 499, "mo"],
    ],
  },
  {
    // TODO: pieces drafted by Claude, confirm with the team
    id: "msg",
    g: "reach",
    t: "Email, SMS & WhatsApp Marketing",
    items: [
      ["Email newsletter and campaign design", 1499, "mo"],
      ["Automated email sequences (welcome, follow-up)", 1999, "once"],
      ["SMS campaign setup and sending", 999, "mo"],
      ["WhatsApp Business setup and catalogue", 999, "once"],
      ["WhatsApp broadcast campaigns", 1299, "mo"],
      ["List segmentation and reporting", 699, "mo"],
    ],
  },
  {
    id: "local",
    g: "reach",
    t: "Local Business Marketing",
    items: [
      ["Google Business Profile setup and optimization", 1499, "once"],
      ["Business information and category optimization", 699, "once"],
      ["Local keyword research and local SEO recommendations", 999, "once"],
      ["Business listing consistency checks", 799, "once"],
      ["Customer review strategy and local visibility monitoring", 999, "mo"],
    ],
  },
  {
    id: "web",
    g: "web",
    t: "Website Design & Development",
    items: [
      ["Business website, responsive website or redesign", 9999, "once"],
      ["Landing pages and e-commerce websites", 7999, "once"],
      ["WordPress or other CMS development", 4999, "once"],
      ["Website content, contact and inquiry forms", 1999, "once"],
      ["Domain and hosting assistance", 499, "once"],
      ["Basic security and maintenance setup", 999, "once"],
    ],
  },
  {
    id: "lp",
    g: "web",
    t: "Landing Pages & Conversion Optimization",
    items: [
      ["Campaign-specific landing page design", 4999, "once"],
      ["Lead-generation form integration", 999, "once"],
      ["Call-to-action optimization", 799, "once"],
      ["Page speed and mobile usability improvements", 1499, "once"],
      ["Conversion Rate Optimization (CRO) recommendations", 1499, "once"],
      ["Landing page performance tracking", 499, "mo"],
    ],
  },
  {
    id: "seo",
    g: "web",
    t: "Website SEO & Performance",
    items: [
      ["Technical website audit and indexing checks", 1999, "once"],
      ["Page speed and website structure improvements", 2499, "once"],
      ["Schema markup, where appropriate", 999, "once"],
      ["Analytics integration", 999, "once"],
      ["Ongoing website maintenance and optimization", 1499, "mo"],
    ],
  },
  {
    id: "saas",
    g: "web",
    t: "SaaS & Custom Web Applications",
    items: [
      ["Custom web application and SaaS development", 49999, "once"],
      ["Customer dashboards and admin panels", 14999, "once"],
      ["API integrations and database design", 9999, "once"],
      ["User authentication and role-based access", 7999, "once"],
      ["Business-specific software solutions", 24999, "once"],
    ],
  },
];

// Flat lookup: "igfb-0" -> { id, svc, name, price, b }
export const pieces: Record<string, Piece> = {};
services.forEach((s) =>
  s.items.forEach(([name, price, b], i) => {
    pieces[`${s.id}-${i}`] = { id: `${s.id}-${i}`, svc: s, name, price, b };
  }),
);
export const idsOf = (s: Service) => s.items.map((_, i) => `${s.id}-${i}`);

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export function totals(ids: string[]) {
  let mo = 0,
    once = 0;
  ids.forEach((id) => {
    const p = pieces[id];
    if (!p) return;
    if (p.b === "mo") mo += p.price;
    else once += p.price;
  });
  return { mo, once };
}
