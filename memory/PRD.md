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

## Backlog
- P1: Admin view for enquiries (protected route or simple list page)
- P1: Real social links + real contact email for NOCAP
- P2: CMS-editable client case studies (currently static in `src/lib/data.ts`)
- P2: Image/logo upload (object storage) instead of text-name logo slots
- P2: OG meta tags + favicon PNG fallbacks
