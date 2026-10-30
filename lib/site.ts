export type Member = {
  name: string;
  role: string;
  photo: string | null;
  owns: string;
  tags: string[];
};

// Edit this file: everything on the page that is "yours" lives here.
export const site = {
  name: "GrowWheel",
  tagline: "SEO, Paid Ads and Web. One team, zero handoffs.",
  email: "growwheel.agency@gmail.com", // TODO: real email
  phone: "+91 82873 77830", // TODO: real number
  whatsapp: "918287377830", // TODO: digits only, with country code
  location: "India",
  // Replace "photo" with a path like "/team/one.jpg" (put images in /public/team)
  team: <Member[]>[
    {
      name: "Founder name",
      role: "Strategy & SEO",
      photo: null,
      owns: "Owns your search presence and the plan behind every campaign, so nothing runs without a reason.",
      tags: ["SEO", "SEM", "Strategy"],
    },
    {
      name: "Founder name",
      role: "Paid Ads & Social",
      photo: null,
      owns: "Owns your Meta and Google ads, plus Instagram and WhatsApp, and watches every rupee spent.",
      tags: ["Meta Ads", "Social", "Email"],
    },
    {
      name: "Founder name",
      role: "Web & Design",
      photo: null,
      owns: "Owns the website, SaaS builds and visuals your campaigns land on, built to convert, not just to look good.",
      tags: ["Web & SaaS", "UI/UX", "Design"],
    },
  ],
};
