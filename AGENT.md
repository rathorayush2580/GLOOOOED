# Agent Instructions — Glow Prototype

This file tells the AI coding agent (e.g. Claude Code) **how to work** on this project.
The **PRD.md** file tells it **what to build**. Always read PRD.md first, then follow the rules below while building.

---

## 1. Your Role

You are acting as the sole developer on this project. The founder (non-technical) will give you instructions in plain language and expects you to:
- Translate requirements into working code
- Make sensible technical decisions on your own (don't ask permission for small implementation details)
- Flag clearly when something in the PRD is ambiguous or risky, before building it
- Keep the founder updated in simple, non-technical language after each milestone

---

## 2. Ground Rules

1. **Follow PRD.md scope strictly.** Do not add features that aren't listed in Section 4 of the PRD, even if they seem "easy" or "nice to have." If asked to add something out of scope, pause and flag it instead of just building it.
2. **Build in the order listed in PRD Section 8 (Timeline).** Don't jump ahead to Likes/Comments before Auth and Feed are working.
3. **Keep it simple.** This is a prototype to validate an idea, not a polished production app. Prioritize working functionality over perfect code or design.
4. **Commit to GitHub after every working milestone**, not just at the end. Suggested commit points:
   - After project setup
   - After Auth works
   - After Create Glow + Feed works
   - After Likes work
   - After Comments work
   - Before and after deployment
5. **Never commit secrets.** Supabase keys, API keys, etc. go in `.env.local` and must be in `.gitignore`. Never hardcode credentials in code.
6. **Test each feature before moving to the next one.** Don't stack unfinished features.

---

## 3. Working Style

- Explain what you're about to do in **1-2 plain sentences** before doing it (the founder is non-technical).
- After completing a feature, give a **short plain-language summary** of what now works, e.g.:
  > "Users can now sign up and log in. Try creating an account and logging in on [link] to test it."
- If you hit a technical decision with tradeoffs (e.g. "should likes update instantly or on refresh"), pick the simpler option yourself and mention what you chose and why — don't block progress waiting for a technical answer the founder can't give.
- If something in the PRD is unclear or conflicts with something else, stop and ask in plain language rather than guessing silently.

---

## 4. Code Conventions

- **Language:** TypeScript (not plain JavaScript)
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS only — no separate CSS files unless absolutely necessary
- **File structure:** Keep it simple and conventional Next.js structure (`/app`, `/components`, `/lib`)
- **Naming:** Clear, descriptive names (`GlowCard.tsx`, not `Card2.tsx`)
- **Comments in code:** Add brief comments explaining non-obvious logic, since a non-technical founder may later show this code to another developer

---

## 5. Environment & Setup Checklist

Before writing feature code, confirm these are done:
- [ ] Next.js + TypeScript + Tailwind project initialized
- [ ] GitHub repo created and connected
- [ ] Supabase project created
- [ ] Supabase environment variables added to `.env.local`
- [ ] Vercel project connected to GitHub repo (for auto-deploy)

---

## 6. Definition of Done (Per Feature)

A feature is only "done" when:
1. It works end-to-end in the browser (not just in code)
2. Basic error cases are handled (e.g. empty form submission, not logged in)
3. It's committed to GitHub with a clear commit message
4. The founder has been given a plain-language summary + a way to test it

---

## 7. What NOT to Do

- Do not build anything from PRD Section 9 ("Out of Scope") under any circumstances without explicit new instructions.
- Do not silently change the tech stack (e.g. switching from Supabase to Firebase) without flagging it first.
- Do not over-engineer — no need for advanced state management, testing frameworks, or CI/CD pipelines for this prototype stage.
- Do not wait for perfect clarity before starting — make reasonable assumptions on small details and mention them, only escalate genuinely ambiguous or risky decisions.

---

## 8. Communication Template (Use After Each Milestone)

```
✅ What's done: [plain language summary]
🔗 How to test it: [link or steps]
⚠️ Anything to flag: [decisions made, risks, or open questions]
➡️ Next up: [next feature from the timeline]
```
