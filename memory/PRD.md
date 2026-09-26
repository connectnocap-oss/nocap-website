# NOCAP — Agency Landing Page PRD

## Original Problem Statement
Build a landing page for "nocap" matching 5 reference screenshots: (1) hero photo slider with an opening hook + replaceable brand logo wall (10-15 slots), (2) "Our clients in the lead" split section with 5 client result cards, (3) 4-column stats strip, (4) "Numbers mean more when they tell a story" editorial block, (5) "Our expertise" horizontal accordion slider with 7 services (social media management, influencer marketing, video & graphic editing, meta & chatgpt ads, brand integration, sourcing, event management), then a footer.

## User Choices
- Images: AI-generated (16 images, nightlife/editorial aesthetic)
- Hero hook: fresh copy in the reference's tone ("Every brand is posting. Almost none are remembered.")
- Footer: "Start Something" contact form that saves enquiries to the database

## Architecture
- Frontend: Vite + React 19 + TS, Tailwind v4, motion (framer-motion) for reveals, Lenis smooth scroll, shadcn/ui (dialog, input, textarea, label, button, sonner)
- Sections: Nav, Hero slider (autoplay crossfade + parallax + masked line reveal), editorial Marquee, LogoWall (14 slots, replaceable via dialog, persisted to localStorage), ClientsLead (5 result cards), StatsStrip (count-up), NumbersStory (6-stat grid), Expertise (7-panel accordion slider), Footer (contact form + giant wordmark)
- Backend: FastAPI, `POST /api/enquiries` (201) + `GET /api/enquiries`, MongoDB `enquiries` collection (uuid ids, created_at desc index)
- Brand mark: "NØCAP" slashed-O wordmark; favicon.svg = forest rounded square, cream circle, lime slash

## User Personas
- Brand founder/CMO evaluating the agency (reads proof, sends a brief)
- Agency admin (replaces client logos in-browser, reads enquiries via API)

## Implemented (2026-09-24)
- Full landing page per the 5 references, all AI-generated imagery
- Contact form persists to MongoDB; verified 201 + 422 validation + browser e2e submission
- Logo wall replace dialog with localStorage persistence; verified in browser
- Accordion, count-up stats, marquee, parallax hero — verified via screenshots

## Implemented (2026-09-26)
- Owner-managed imagery everywhere: hero slider (4 slots), 3 case study cards, 7 expertise panels, and the 14-slot logo wall all accept real image uploads from the browser — stored permanently via Emergent object storage (`POST /api/uploads`, `GET /api/files/*`) with overrides in the `content` Mongo doc (`GET/PUT /api/content`)
- Real NOCAP logo (user-supplied PNG) used as a CSS-masked mark, recolored to forest green in nav and lime for the giant footer wordmark
- New Sellio-style header bar: Home / Our Work / Services + lime "PULL UP" CTA
- New copy throughout: hero ("You didn't find us. We let you."), dark marquee ticker, "Our clients get paid first." (PRFCTSOUND, Kibba Superior, District 9), "Our Social Media Process" 4-week block, "The Work Speaks" stats, 7 new expertise panels, "Pull up, if you're serious." footer with Connect.nocap@gmail.com

## Implemented (2026-09-26, v3)
- Owner admin panel at `/admin` (single password, JWT 7-day token, 5-strike IP lockout): edit every text on the site, all 14 logo slots (name + image), 4 hero slides, 3 case cards (text + photo), 6 work-stats, 7 expertise panels (text + photo), art banner, footer/socials
- Edit-mode gating: on-page Replace/upload chips render only when logged in; `PUT /api/content` and `POST /api/uploads` are Bearer-guarded (401 without token)
- Enquiry email notifications to Connect.nocap@gmail.com via Emergent-managed Resend (verified 202 Accepted)
- Collage art-break band (original AI-generated piece, parallax + spinning starburst SVGs); bigger logo wall; tightened section gaps; stats strip removed; hero slide titles removed; footer logo reduced; live Instagram + mail icons

## Implemented (2026-09-26, v4)
- Instagram icon wired to instagram.com/nocapconnect (default + stored content both updated)
- Art break band now uses the user's own faces-collage artwork (`/art-default.png`), still replaceable in admin
- New "We're serving results." gallery: 5 floating tilted reel-result cards (views + likes chips, hover lift, gentle bob) — images, view/like counts all editable in admin
- Image focus adjust: every admin image field has a 3×3 focus-dot picker (object-position) for hero slides, client cards, expertise panels, art banner, and result cards
- Extra graphic accents: spinning starbursts on art break, results gallery, and footer eyebrow

## Backlog
- P1: Admin view for enquiries (protected route or simple list page)
- P1: Real social links + real contact email for NOCAP
- P2: CMS-editable client case studies (currently static in `src/lib/data.ts`)
- P2: Image/logo upload (object storage) instead of text-name logo slots
- P2: OG meta tags + favicon PNG fallbacks
