// Pricing plans: every service, the pieces inside it and their prices (USD).
// b: "mo" = billed monthly, "once" = one-time. Edit prices here only.
export type Billing = "mo" | "once";
export type Service = {
  id: string;
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
export type Plan = {
  id: string;
  name: string;
  sub: string;
  price: number; // discounted monthly price of the included pieces
  included: string[];
  services: Service[];
};

const growth: Service[] = [
  {
    id: "igfb",
    t: "Instagram & Facebook Account Management",
    items: [
      ["Profile setup, optimization, and branding", 12, "once"],
      ["Content planning and monthly content calendars", 18, "mo"],
      ["Content scheduling and publishing", 12, "mo"],
      ["Caption writing, hashtag research, and content optimization", 9, "mo"],
      ["Content ideas based on industry trends", 6, "mo"],
      ["Social Media Optimization (SMO)", 12, "mo"],
    ],
  },
  {
    id: "content",
    t: "Content Creation & Publishing",
    items: [
      ["Reels, posts, carousels, and Stories", 29, "mo"],
      ["Graphic design and promotional creatives", 18, "mo"],
      ["Short-form video editing and YouTube long video editing", 24, "mo"],
    ],
  },
  {
    id: "meta",
    t: "Meta Ads Management",
    items: [
      ["Facebook and Instagram campaign setup and management", 35, "mo"],
      ["Audience research and targeting", 12, "once"],
      ["Awareness, traffic, engagement, and lead-generation campaigns", 18, "mo"],
      ["Campaign monitoring, optimization, and performance reporting", 12, "mo"],
    ],
  },
  {
    id: "local",
    t: "Local Business Marketing",
    items: [
      ["Google Business Profile setup and optimization", 18, "once"],
      ["Business information and category optimization", 8, "once"],
      ["Local keyword research and local SEO recommendations", 12, "once"],
      ["Business listing consistency checks", 9, "once"],
      ["Customer review strategy and local visibility monitoring", 12, "mo"],
    ],
  },
];

const web: Service = {
  id: "web",
  t: "Website Design & Development",
  items: [
    ["Business websites, responsive websites, and redesigns", 119, "once"],
    ["Landing pages and e-commerce websites", 95, "once"],
    ["Custom web application and SaaS development", 589, "once"],
    ["Customer dashboards and admin panels", 179, "once"],
  ],
};

const basics = ["igfb-1", "igfb-2", "igfb-3", "content-0", "content-1"];

export const plans: Plan[] = [
  {
    id: "traction",
    name: "Traction",
    sub: "Your social media, planned, made and published for you.",
    price: 79,
    included: basics,
    services: growth,
  },
  {
    id: "momentum",
    name: "Momentum",
    sub: "Everything in Traction, plus Meta ads. Add a website anytime.",
    price: 99,
    included: [...basics, "meta-0"],
    services: [...growth, web],
  },
];

// Flat lookup: "igfb-0" -> { id, svc, name, price, b }
export const pieces: Record<string, Piece> = {};
[...growth, web].forEach((s) =>
  s.items.forEach(([name, price, b], i) => {
    pieces[`${s.id}-${i}`] = { id: `${s.id}-${i}`, svc: s, name, price, b };
  }),
);
export const idsOf = (s: Service) => s.items.map((_, i) => `${s.id}-${i}`);

export const usd = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
// Included pieces share the plan's discount, so removing one always lowers the price.
export function planTotals(plan: Plan, ids: string[]) {
  const full = plan.included.reduce((sum, id) => sum + pieces[id].price, 0);
  const rate = plan.price / full;
  let mo = 0,
    list = 0,
    once = 0;
  ids.forEach((id) => {
    const p = pieces[id];
    if (p.b === "once") {
      once += p.price;
      return;
    }
    list += p.price;
    mo += plan.included.includes(id) ? p.price * rate : p.price;
  });
  return { mo: Math.round(mo), once, saved: Math.round(list - mo) };
}
