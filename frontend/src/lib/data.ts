const IMG = "https://static.prod-images.emergentagent.com/jobs/a95990dc-61d9-443d-b7e0-2e5cd2382ef4/images";

export interface Slide {
  src: string;
  tag: string;
  title: string;
}

export const HERO_SLIDES: Slide[] = [
  {
    src: `${IMG}/2654b75a8024742bb888fea3eb756eeb6bb343f243710263a8745c87980a9682.jpeg`,
    tag: "Launches & Soirees",
    title: "The kind of night a brand gets named after.",
  },
  {
    src: `${IMG}/1f57b41942611ad277072e597ce3f8ae5f6d9a02b087a640059cdd655bdc8b08.jpeg`,
    tag: "Rooftop Takeovers",
    title: "Whole venues, rewired around one brand.",
  },
  {
    src: `${IMG}/1b4ebe023423fae0b18d22e8eb5d03f10719ce290a0ccfaa56792aa92738d47c.jpeg`,
    tag: "Festivals & IPs",
    title: "Stages we built. Crowds we earned.",
  },
  {
    src: `${IMG}/3968b2fe6ee2d6db520f89ef183a7153bed85824311cb40ede672e5baf37adc1.jpeg`,
    tag: "Spirits & Nightlife",
    title: "Culture you can taste. Content you can't skip.",
  },
];

export interface Brand {
  name: string;
  className: string;
}

export const DEFAULT_BRANDS: Brand[] = [
  { name: "CONAN BEER", className: "font-heading font-black tracking-tighter text-lg" },
  { name: "TAJ", className: "font-serif tracking-[0.45em] text-lg" },
  { name: "WESTIN", className: "font-sans font-medium tracking-[0.35em] text-base" },
  { name: "tinder", className: "font-heading font-bold lowercase text-xl" },
  { name: "SIMBA", className: "font-heading font-black italic tracking-tight text-lg" },
  { name: "STOLI", className: "font-mono font-bold tracking-[0.4em] text-base" },
  { name: "NICOBAR GIN", className: "font-sans tracking-[0.3em] text-xs" },
  { name: "Tito's Handmade", className: "font-serif italic text-xl" },
  { name: "GREATER THAN", className: "font-heading font-semibold tracking-[0.3em] text-sm" },
  { name: "KATI PATANG", className: "font-sans font-bold tracking-[0.2em] text-sm" },
  { name: "CASA CLARO", className: "font-serif tracking-[0.25em] text-base" },
  { name: "PISTOLA", className: "font-heading font-black tracking-tight text-lg" },
  { name: "CATWALK", className: "font-sans font-light tracking-[0.45em] text-sm" },
  { name: "MONKEY SHOULDER", className: "font-serif italic font-bold text-base" },
];

export interface ClientResult {
  client: string;
  sub: string;
  stats: [string, string][];
  tags: string[];
  image: string;
}

export const CLIENT_RESULTS: ClientResult[] = [
  {
    client: "PRFCTSOUND",
    sub: "Artist Social Management",
    stats: [
      ["5.2x", "Revenue growth in 90 days"],
      ["3K+", "New followers from content"],
    ],
    tags: ["Social Media Management", "Content Marketing"],
    image: `${IMG}/24045538d785eee1589219f2be25c6774495ba037938f51c5e7fd8db60e2fabd.jpeg`,
  },
  {
    client: "Kibba Superior",
    sub: "Event Partnerships",
    stats: [
      ["3.5M+", "Sponsorship deals negotiated"],
      ["24", "Event partnerships landed in first quarter"],
    ],
    tags: ["Event Sponsorship", "Rate Negotiation"],
    image: `${IMG}/ae3bb19ef591b0266afd463c1c6f1e3c7175d562971f50b0245aed51e8c6734f.jpeg`,
  },
  {
    client: "District 9",
    sub: "Service / Sports",
    stats: [
      ["50", "Influencer outreach per event"],
      ["15", "Qualified influencers provided per month for events"],
    ],
    tags: ["Event", "Community Management"],
    image: `${IMG}/1b4ebe023423fae0b18d22e8eb5d03f10719ce290a0ccfaa56792aa92738d47c.jpeg`,
  },
];

export interface StripStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export const STRIP_STATS: StripStat[] = [
  { value: 74, prefix: "$", suffix: "M", label: "Driving growth with strategy." },
  { value: 95, suffix: "%", label: "Building trusted partnerships." },
  { value: 225, prefix: "+", label: "Delivering industry success." },
  { value: 92, suffix: "%", label: "Turning traffic into growth." },
];

export const STORY_STATS: [string, string][] = [
  ["12+", "Industries we've run campaigns in."],
  ["2,500+", "Creators in our active network."],
  ["4,000+", "Pieces of content shipped."],
  ["55+", "Brand deals closed."],
  ["10.8M+", "Organic + campaign reach."],
  ["72%", "Average engagement uplift."],
];

export interface Service {
  title: string;
  description: string;
  tags: string[];
  image: string;
}

export const SERVICES: Service[] = [
  {
    title: "Social Media Management",
    description:
      "Content strategy, production, and a calendar that's actually tied to a business outcome — not just filled for the sake of it.",
    tags: ["Strategy", "Content Calendar", "Community"],
    image: `${IMG}/fbddfedc762ccffc8dc12b0ef4f7c883948a648638ce7fce6181e6187899c8bf.jpeg`,
  },
  {
    title: "Influencer Marketing",
    description:
      "Creator sourcing and vetting done right the first time — three right-fit partners beat twenty mismatched ones, every time.",
    tags: ["Sourcing", "Vetting", "Campaign Management"],
    image: `${IMG}/199893cf5dc20bd2bdc862d647825c6293c90072cb574cd8dbecbcce6e124e34.jpeg`,
  },
  {
    title: "Brand Sponsorship & Deals",
    description:
      "You shouldn't have to ask for what you're worth. We pitch, negotiate, and close — so the offer comes to you.",
    tags: ["Outreach", "Rate Negotiation", "Contracts"],
    image: `${IMG}/59c577697882b4bae71d45bc38d4b368f79c22837501ff8cad9fd9a41eb7a2fb.jpeg`,
  },
  {
    title: "Content & Creative",
    description:
      "Built for the first three seconds, because that's all the algorithm gives you. Native to Reels, TikTok, and Shorts — never a repurposed ad.",
    tags: ["Short-Form Edits", "Captions", "Creative Direction"],
    image: `${IMG}/a956ef7a3d909e38bd1bb429d4dbb5dae08fabdc5efb7cf5a6b71aa1be8bbe3c.jpeg`,
  },
  {
    title: "Reporting & Analytics",
    description:
      "Numbers, not vibes. Monthly reporting tied to the one metric you actually care about, not vanity fluff.",
    tags: ["Performance Reports", "ROI Tracking", "Dashboards"],
    image: `${IMG}/c995c002534039d6f22b248d02d79133f4c00ec9fc14d6a8bacdcdc76b45b391.jpeg`,
  },
  {
    title: "Community Management",
    description:
      "Every comment, DM, and mention handled like it's the only one that matters — because to that person, it is.",
    tags: ["DMs", "Comments", "Engagement"],
    image: `${IMG}/ae3bb19ef591b0266afd463c1c6f1e3c7175d562971f50b0245aed51e8c6734f.jpeg`,
  },
  {
    title: "Strategy & Positioning",
    description:
      "Media kits, positioning, and a growth roadmap built around what your brand actually needs — not a template.",
    tags: ["Media Kits", "Positioning", "Growth Roadmap"],
    image: `${IMG}/2f86f25cbfa43cee66213b3a7cf3e42eac075ade54ca0c2fe9720917b3f9b60f.jpeg`,
  },
];

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  brand?: string | null;
  message: string;
  created_at: string;
}
