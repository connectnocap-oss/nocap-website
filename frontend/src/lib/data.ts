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
  stats: [string, string][];
  tags: string[];
  image: string;
}

export const CLIENT_RESULTS: ClientResult[] = [
  {
    client: "Conan Beer",
    stats: [
      ["750%", "Return on ad spend in 6 months"],
      ["95K", "New followers from targeted campaigns"],
    ],
    tags: ["Paid Ads", "Content Strategy", "Conversion"],
    image: `${IMG}/32c6b9d329e2dd8d4c8623143ae3350e5f782d60dd879febb0093b57bdf015db.jpeg`,
  },
  {
    client: "Taj × Westin",
    stats: [
      ["12M+", "Campaign impressions across metro cities"],
      ["38", "Secret chef tables sold out"],
    ],
    tags: ["Luxury Hospitality", "Influencer Curation"],
    image: `${IMG}/ed2779fbed9fb987f433e24fd2f045f6df4c694bf4299da12af990bc18d4bee6.jpeg`,
  },
  {
    client: "Tinder Mixers",
    stats: [
      ["+30M", "Viral views across launch films"],
      ["26", "Cities activated in one quarter"],
    ],
    tags: ["Event IP", "Youth Culture"],
    image: `${IMG}/ae3bb19ef591b0266afd463c1c6f1e3c7175d562971f50b0245aed51e8c6734f.jpeg`,
  },
  {
    client: "Nicobar Gin",
    stats: [
      ["400K", "Bottles moved through bar takeovers"],
      ["4.8x", "Blended ROAS on launch"],
    ],
    tags: ["Sourcing", "Bar Takeovers"],
    image: `${IMG}/cf8a182fbd90371c3aeda9e3c8d7ab7c23423d526ffdea0c324f52d036ae600c.jpeg`,
  },
  {
    client: "Simba Events",
    stats: [
      ["3.2M+", "Organic & campaign reach"],
      ["65%", "Average engagement uplift"],
    ],
    tags: ["Creator Network", "Meta & AI Ads"],
    image: `${IMG}/24045538d785eee1589219f2be25c6774495ba037938f51c5e7fd8db60e2fabd.jpeg`,
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
  ["10+", "Branded nightlife & cultural IPs"],
  ["20+", "Brands across categories"],
  ["5,500+", "People pulled into a single cultural moment"],
  ["100+", "Creators activated"],
  ["3.2M+", "Organic & campaign reach"],
  ["65%", "Average engagement uplift"],
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
      "Feeds that don't feel like feeds. We run content engines — calendars, community, and creative people actually save and share.",
    tags: ["Content Engines", "Community", "Analytics"],
    image: `${IMG}/fbddfedc762ccffc8dc12b0ef4f7c883948a648638ce7fce6181e6187899c8bf.jpeg`,
  },
  {
    title: "Influencer Marketing",
    description:
      "We cast creators like directors cast films — right face, right audience, right moment — then let them do what they do best.",
    tags: ["Creator Casting", "UGC", "Whitelisting"],
    image: `${IMG}/199893cf5dc20bd2bdc862d647825c6293c90072cb574cd8dbecbcce6e124e34.jpeg`,
  },
  {
    title: "Video & Graphic Editing",
    description:
      "Scroll-stopping edits, key art, and motion design built for the first three seconds — because three seconds is all you get.",
    tags: ["Reels & Films", "Motion Design", "Key Art"],
    image: `${IMG}/a956ef7a3d909e38bd1bb429d4dbb5dae08fabdc5efb7cf5a6b71aa1be8bbe3c.jpeg`,
  },
  {
    title: "Meta & ChatGPT Ads",
    description:
      "Performance media with an AI co-pilot. We iterate creatives with ChatGPT daily and scale whatever the data falls in love with.",
    tags: ["Performance Media", "AI Iteration", "Funnels"],
    image: `${IMG}/c995c002534039d6f22b248d02d79133f4c00ec9fc14d6a8bacdcdc76b45b391.jpeg`,
  },
  {
    title: "Brand Integration",
    description:
      "Your brand woven into moments people already love — events, creators, menus, and culture. Never bolted on.",
    tags: ["Product Placement", "Partnerships", "On-Ground"],
    image: `${IMG}/59c577697882b4bae71d45bc38d4b368f79c22837501ff8cad9fd9a41eb7a2fb.jpeg`,
  },
  {
    title: "Sourcing",
    description:
      "Venues, vendors, artists, and everything in between. Our black book is deep, and our rates go deeper.",
    tags: ["Venues", "Vendors", "Production"],
    image: `${IMG}/d4be425353f908d9a67c8651cef390be1eeef6251bc9775abf518353bac7369f.jpeg`,
  },
  {
    title: "Event Management",
    description:
      "From 50-person chef tables to 5,000-person IPs — concept to curtain call, we run the whole show.",
    tags: ["Launches", "IPs", "Tours"],
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
