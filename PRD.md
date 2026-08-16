# Product Requirements Document (PRD)
## Project: Glow — Sticky Note Social Feed (Prototype)

**Version:** 1.0
**Date:** August 15, 2026
**Target Launch (Prototype):** September 5, 2026
**Prepared for:** AI Coding Agent Implementation

---

## 1. Overview

**Glow** is a lightweight social web app where users post short, sticky-note-style updates called "Glows." Other users can view these in a feed and engage with likes and comments. This is a **scoped-down prototype** of a larger vision ("GLOOOOED" — a full social network), built to validate the core content format before expanding further.

### 1.1 Purpose of This Prototype
- Test whether the "sticky note" post format resonates with users
- Validate basic engagement (posting, liking, commenting)
- Serve as a foundation to expand into the larger product later
- Must be built within a **3-week timeline**

### 1.2 What This Prototype Is NOT
To keep scope realistic, the following are **explicitly excluded** from this version:
- ❌ User profile customization ("Aura" profiles)
- ❌ Direct messaging
- ❌ Stickers / reactions beyond like
- ❌ AI-powered editing tools
- ❌ Stories / discovery feed / trending
- ❌ Notifications system
- ❌ Follow/unfollow system (optional — see Section 4.6 if time permits)

---

## 2. Goals & Success Criteria

| Goal | Success Metric |
|---|---|
| Ship a working prototype | Live, publicly accessible URL by Sept 5, 2026 |
| Validate core loop | Users can sign up, post a Glow, see it in feed, like/comment |
| Keep scope minimal | No feature creep beyond Section 4 |
| Enable fast iteration | Codebase clean enough to extend post-validation |

---

## 3. Tech Stack

| Layer | Tool | Notes |
|---|---|---|
| Frontend Framework | **Next.js** (React) | App Router, TypeScript preferred |
| Styling | **Tailwind CSS** | Utility-first, fast to style sticky-note UI |
| Backend / Database / Auth | **Supabase** | Postgres DB + built-in Auth + Storage |
| Hosting / Deployment | **Vercel** | Free tier, auto-deploys from GitHub |
| Version Control | **GitHub** | Source of truth, connected to Vercel for CI/CD |
| AI Coding Agent | Claude Code (or equivalent) | Used to generate and iterate on code |

---

## 4. Feature Requirements

### 4.1 Authentication
- Users can **sign up** with email + password (via Supabase Auth)
- Users can **log in / log out**
- Basic session persistence (stay logged in on refresh)
- No email verification required for prototype (can be added later)

**Acceptance Criteria:**
- [ ] New user can create an account
- [ ] Existing user can log in
- [ ] Logged-in state persists across page reloads
- [ ] Logout works and redirects to login page

---

### 4.2 Create a "Glow" (Sticky Note Post)
- Logged-in users can create a new Glow via a simple form/modal
- A Glow consists of:
  - **Text content** (required, character limit ~280 chars)
  - **Color** (optional — pick from 4-5 preset sticky-note colors, e.g. yellow, pink, blue, green)
  - **Author** (auto-attached from logged-in user)
  - **Timestamp** (auto-generated)

**Acceptance Criteria:**
- [ ] User can open a "Create Glow" input/modal
- [ ] User can type text and select a color
- [ ] On submit, Glow is saved to database
- [ ] Empty submissions are blocked (basic validation)

---

### 4.3 Feed
- Displays all Glows in **reverse chronological order** (newest first)
- Each Glow card shows:
  - Sticky-note style background (based on chosen color)
  - Author name/username
  - Text content
  - Timestamp (e.g. "2m ago")
  - Like count + comment count
- Feed should auto-refresh or have a manual refresh option (auto-refresh not required for v1 — manual reload is acceptable)

**Acceptance Criteria:**
- [ ] All Glows visible in a scrollable feed
- [ ] Newest Glow appears at top
- [ ] Visual style resembles a sticky note (rotation/shadow effects are a nice-to-have, not required)

---

### 4.4 Likes
- Logged-in users can like/unlike a Glow (toggle)
- Like count updates in real time or on refresh
- A user can only like a given Glow once

**Acceptance Criteria:**
- [ ] Like button toggles on/off
- [ ] Like count reflects accurate total
- [ ] Duplicate likes from same user are prevented

---

### 4.5 Comments
- Logged-in users can add a text comment to any Glow
- Comments displayed in a simple list under/within the Glow (can be a click-to-expand section)
- No nested replies needed (flat comment list only)

**Acceptance Criteria:**
- [ ] User can submit a comment
- [ ] Comment appears attached to the correct Glow
- [ ] Comment shows author name + timestamp

---

### 4.6 (Optional / Stretch Goal — Only if Time Permits)
- Follow/unfollow other users
- Filter feed to show only followed users' Glows

*Do not build this unless core features (4.1–4.5) are complete and stable well before the deadline.*

---

## 5. Data Model (Supabase / Postgres)

### `users` (handled by Supabase Auth)
- `id` (uuid, primary key)
- `email`
- `username` (custom field — add to a `profiles` table)
- `created_at`

### `profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid | FK to auth.users.id |
| username | text | display name |
| created_at | timestamp | |

### `glows`
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| user_id | uuid | FK to profiles.id |
| content | text | max 280 chars |
| color | text | e.g. "yellow", "pink" |
| created_at | timestamp | default now() |

### `likes`
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| glow_id | uuid | FK to glows.id |
| user_id | uuid | FK to profiles.id |
| created_at | timestamp | |
| *(unique constraint on glow_id + user_id)* | | prevents duplicate likes |

### `comments`
| Column | Type | Notes |
|---|---|---|
| id | uuid | primary key |
| glow_id | uuid | FK to glows.id |
| user_id | uuid | FK to profiles.id |
| content | text | |
| created_at | timestamp | |

---

## 6. User Flows

### 6.1 New User Flow
1. Land on homepage → see login/signup screen
2. Sign up with email + password
3. Redirected to feed (empty state if no Glows yet)
4. Prompted to create first Glow

### 6.2 Returning User Flow
1. Land on homepage → auto-logged in (session persisted) or login screen
2. See feed with all existing Glows
3. Can create new Glow, like, or comment

### 6.3 Create Glow Flow
1. Click "Create Glow" button
2. Modal/form opens → enter text, pick color
3. Submit → Glow appears at top of feed immediately

---

## 7. Non-Functional Requirements

- **Responsive design:** Should work on both desktop and mobile browsers (since it's a web app, not native)
- **Performance:** Feed should load within 2-3 seconds under normal conditions
- **Security:** Basic Supabase Row Level Security (RLS) policies — users can only edit/delete their own Glows and comments
- **Simplicity over polish:** Prioritize working functionality over pixel-perfect design for this prototype phase

---

## 8. Timeline (3 Weeks)

| Week | Focus |
|---|---|
| Week 1 | Project setup, Supabase schema, Auth (signup/login/logout) |
| Week 2 | Create Glow feature + Feed display |
| Week 3 | Likes, Comments, bug fixes, deploy to Vercel, final testing |

**Target completion:** September 5, 2026

---

## 9. Out of Scope (Explicitly, for This Phase)

This list exists to prevent scope creep during the 3-week build:

- AI-based content editing
- Full "Aura" profile system
- Messaging/DMs
- Push notifications
- Sticker packs / reactions beyond likes
- Mobile native app (iOS/Android)
- Payment/monetization features
- Advanced content moderation tools

*Any of the above can be planned as Phase 2, only after this prototype is validated.*

---

## 10. Open Questions / Decisions Needed

- [ ] Final app/feature naming (currently "Glow" as placeholder)
- [ ] Should color selection be limited to presets, or fully custom? *(Recommendation: presets only, for speed)*
- [ ] Domain name for prototype, or use free Vercel subdomain? *(Recommendation: free subdomain for now)*

---

## 11. Appendix: Instructions for AI Coding Agent

When implementing this PRD with an AI coding agent (e.g., Claude Code), suggested approach:

1. Initialize a new Next.js project with TypeScript and Tailwind CSS
2. Set up Supabase project, create tables per Section 5, enable Row Level Security
3. Implement Auth (signup/login/logout) using Supabase Auth helpers for Next.js
4. Build the Feed page (read Glows from Supabase, display as cards)
5. Build Create Glow form (write to Supabase)
6. Add Like functionality (insert/delete from `likes` table, toggle UI state)
7. Add Comment functionality (insert into `comments`, display list per Glow)
8. Deploy to Vercel, connect GitHub repo for auto-deployment
9. Test full user flow end-to-end before sharing prototype link

