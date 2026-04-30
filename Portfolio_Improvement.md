# 🚀 Portfolio Content Improvement Prompt — Peter Paul Lazan
> **Instructions for Claude Code:** Execute this prompt **phase by phase**.
> At the end of each phase, output a detailed execution plan, then **stop and ask:**
> > _"Continue with the next phase?"_
> Only proceed when the user replies **"Yes, Proceed"**.
> **DO NOT change the base design.** All changes are content and copy only unless explicitly stated.

---

## 📋 CONTEXT

This is a portfolio for **Peter Paul Lazan**, a Full-Stack Developer, Mobile App DevOps, and IT Systems & Credential Administrator based in Davao City, Philippines.

The portfolio is built with **React + Tailwind CSS**, deployed on **Vercel**.

The goal of these improvements is to **get Peter hired faster** by making the content more compelling to recruiters and hiring managers — without touching the existing design system, layout, colors, or component structure.

---

## 🔵 PHASE 1 — Hero / Homepage Header Section

### 🎯 Objective
Make it immediately clear to any visitor that Peter is **available for work** and what kind of work he does best.

### 📌 Execution Plan (present this before executing)
1. Locate the hero/header component (likely `Hero.jsx`, `Header.jsx`, or `index page` root section).
2. Add an **"Open to Work"** availability badge near Peter's name — a small green pulsing dot or pill label styled inline (use existing Tailwind classes only, no new CSS files).
3. Update the subtitle/tagline below the name from the current generic title to a **value proposition sentence**:
   > _"I build fast, scalable web and mobile apps — and I ship on time."_
4. Add an **"Open for:"** line with pill/badge tags below the tagline listing:
   - ✅ Full-Stack Web Development
   - ✅ Mobile App Development (iOS & Android)
   - ✅ AI / ML Integration Projects
   - ✅ Project-Based & Freelance Work
   - ✅ IT Systems & DevOps Support
5. Make the **"Download CV"** button more prominent — increase visual weight (bold text, slightly larger) using existing Tailwind utility classes only.
6. Add a short **response time note** near the contact buttons:
   > _"Usually responds within 24 hours."_

### ✅ Files likely to be modified
- `src/components/Hero.jsx` or equivalent
- `src/pages/index.jsx` or equivalent

### ⚠️ Constraints
- Do NOT change colors, fonts, layout direction, or spacing system
- Use only existing Tailwind classes already in the project
- The green "open to work" dot should use `animate-pulse` if available

---

> ### 🛑 STOP — Present the execution plan above, then ask:
> **"Continue with the next phase?"**

---

## 🔵 PHASE 2 — About Section

### 🎯 Objective
Make the About section more recruiter-friendly — punchy, specific, and scannable.

### 📌 Execution Plan (present this before executing)
1. Locate the About section component.
2. Rewrite the About paragraph to be shorter and more impactful. Replace the current text with:

   > _"I'm a Full-Stack Developer and Mobile App DevOps engineer based in Davao City, Philippines. I specialize in building production-ready web and mobile applications using React, Next.js, React Native, Node.js, and Supabase._
   >
   > _I use AI-assisted development to accelerate delivery without cutting corners — shipping faster while maintaining clean, scalable code. I've built and deployed real-world SaaS platforms, internal tools, mobile apps, and AI-powered systems for actual companies._
   >
   > _I'm currently open to full-time roles, project-based contracts, or freelance work — locally or remotely."_

3. Add a **"How I Build"** subsection below the About paragraph — a compact visual reference (text-based, no image required) showing Peter's personal development workflow:

   ```
   Plan → Design → Build → Test → Deploy
   ```

   With a one-liner under each step:
   - **Plan** — Define scope, tech stack, and architecture using AI-assisted research
   - **Design** — Wireframe with Figma or sketch components structure
   - **Build** — Develop with React / Next.js / React Native + Supabase backend
   - **Test** — Manual + automated checks, cross-device QA
   - **Deploy** — CI/CD via Vercel, Expo EAS, or GitHub Actions

4. Style each step using existing badge/tag components from the project — keep it inline and minimal.

### ✅ Files likely to be modified
- `src/components/About.jsx` or equivalent

### ⚠️ Constraints
- No layout changes
- No new components — reuse existing badge/tag patterns
- Keep the "How I Build" section visually subtle, not dominant

---

> ### 🛑 STOP — Present the execution plan above, then ask:
> **"Continue with the next phase?"**

---

## 🔵 PHASE 3 — Projects Section (Impact & Case Study Copy)

### 🎯 Objective
Add impact-driven descriptions to the top featured projects so recruiters understand the **value delivered**, not just the tech used.

### 📌 Execution Plan (present this before executing)
1. Locate the Projects data file (likely `src/data/projects.js`, `projects.ts`, or a `constants` file).
2. Update the description copy for the following **featured projects only** (do not touch others):

   **HRIS SaaS Platform**
   > _"A comprehensive HR platform handling employee management, payroll tracking, and attendance — built for multi-role access with a responsive web and mobile interface."_

   **My AI Assistant (Local LLM, RAG System)**
   > _"A fully offline AI assistant that reads private documents and answers questions with context — no API keys, no cloud. Built with Ollama, ChromaDB, and FastAPI."_

   **PayUp — Late Payment Escalator**
   > _"A mobile app that automates payment reminders and escalation workflows for businesses — reducing manual follow-ups with push notifications and payment tracking."_

   **Chat System — Company Internal Chat**
   > _"A real-time internal chat system with role-based access control, file/image sharing via Cloudinary, and read receipts — deployed for a live company."_

   **LP CRM — Customer Relationship Management**
   > _"A full-stack CRM for a real sales team — managing leads, pipeline stages, customer profiles, and activity logs across the organization."_

3. Add a **"Currently Building"** card or tag to the most recent/active project (HRIS SaaS Platform or whichever is most current) — use an existing badge component styled with a subtle indicator.

4. On the **All Projects page**, add a short intro line at the top below the title:
   > _"14 projects built and shipped — from SaaS platforms and mobile apps to AI systems and internal tools."_

### ✅ Files likely to be modified
- `src/data/projects.js` or `projects.ts`
- `src/pages/projects.jsx` or equivalent all-projects page

### ⚠️ Constraints
- Do NOT restructure the project card layout
- Only modify description text and add/update existing badge labels
- Do not add new card fields not already in the schema

---

> ### 🛑 STOP — Present the execution plan above, then ask:
> **"Continue with the next phase?"**

---

## 🔵 PHASE 4 — Certifications & Education Page

### 🎯 Objective
Strengthen this page by adding a **"Currently Learning"** signal and improving the copy to feel more active.

### 📌 Execution Plan (present this before executing)
1. Locate the Certifications data file or component.
2. Update the page subtitle from _"Academic achievements and education background"_ to:
   > _"Academic achievements, credentials, and continuous learning."_

3. Add a **"Currently Learning / Pursuing"** section below the existing achievements — using the same card style already on the page — with placeholder entries Peter can fill in:
   - AWS Cloud Practitioner _(in progress)_
   - Or any actual certification Peter is currently pursuing

4. Update the **Dean's List** description to be more specific:
   > _"Consistently made the Dean's List throughout the 4-year BS Information Technology program — awarded for academic excellence each qualifying semester."_

5. Update the Education card description:
   > _"Graduated with academic excellence from a 4-year BS Information Technology program — recognized for outstanding performance in both Industry Immersion and the Capstone Project."_

### ✅ Files likely to be modified
- `src/data/certifications.js` or equivalent
- `src/pages/certifications.jsx` or equivalent

### ⚠️ Constraints
- Do NOT add new card components — reuse the existing achievement card design
- Match the existing icon style for new entries

---

> ### 🛑 STOP — Present the execution plan above, then ask:
> **"Continue with the next phase?"**

---

## 🔵 PHASE 5 — Experience Page Copy Polish

### 🎯 Objective
Make the experience bullet points more result-oriented and ATS-friendly with stronger action verbs.

### 📌 Execution Plan (present this before executing)
1. Locate the Experience data file (likely `src/data/experience.js` or `experience.ts`).
2. Add a **one-line summary** at the top of each experience entry (as a `summary` field if the schema allows, or within the first bullet point):

   **IT Systems & Credential Administrator — Poseidon Distribution OPC**
   > _"Managed full DevOps and IT operations for a growing company — overseeing mobile app deployment, cloud infrastructure, CI/CD pipelines, and cross-team coordination."_

   **Web Developer / IT Support Specialist — The Launchpad Inc**
   > _"Built and deployed full-stack web systems and automated data pipelines for a real company — from internal CRM and chat systems to ETL workflows and server administration."_

3. Update the **Experience page subtitle** from _"4 positions"_ to:
   > _"2+ years of hands-on experience across full-stack development, mobile DevOps, and IT systems administration."_

4. No changes needed to the Transport Coordinator or Customer Service roles — keep as-is.

### ✅ Files likely to be modified
- `src/data/experience.js` or equivalent

### ⚠️ Constraints
- Do NOT change bullet point structure or layout
- Only add the summary field if it already exists in the data schema
- If no summary field exists, prepend the summary as the first bullet point only

---

> ### 🛑 STOP — Present the execution plan above, then ask:
> **"Continue with the next phase?"**

---

## 🔵 PHASE 6 — Blog Page & SEO Meta Copy

### 🎯 Objective
Improve the Blog page intro copy and add SEO-friendly meta descriptions to each post for better Google discoverability.

### 📌 Execution Plan (present this before executing)
1. Locate the Blog data file and the All Blogs page component.
2. Update the **All Blog Posts** page subtitle from _"5 posts"_ to:
   > _"Technical deep-dives on full-stack development, mobile DevOps, AI/ML, and security — written from real production experience."_

3. Add or update the `excerpt`/`description` field for each blog post to be more compelling:

   - **Building a Local RAG System with Ollama and ChromaDB**
     > _"How I built a fully offline AI assistant — no API keys, no cloud, no cost. A step-by-step breakdown of local LLM + vector search."_

   - **React Native CI/CD: Automating iOS & Android Releases with EAS and Vercel**
     > _"A zero-touch deployment pipeline for React Native — from code push to production on both App Store and Google Play, fully automated."_

   - **Supabase RLS: Securing Your Database the Right Way**
     > _"Row-Level Security is Supabase's most powerful and most misunderstood feature. Here's how to get it right without locking yourself out."_

   - **From Firebase to Supabase: A Practical Migration Guide**
     > _"I migrated 3 production apps from Firebase to Supabase in 2025. Here's what worked, what broke, and what I'd do differently."_

   - **Managing Credentials at Scale: A Developer's Security Playbook**
     > _"After rotating 50+ credentials across 8 platforms in one month, I built a system that makes credential management survivable."_

4. If the blog page supports a **"Write with me / Suggest a topic"** CTA, add a subtle line at the bottom:
   > _"Have a topic you'd like me to cover? Reach out — I'm always open to writing about real problems."_

### ✅ Files likely to be modified
- `src/data/blogs.js` or equivalent
- `src/pages/blogs.jsx` or equivalent

### ⚠️ Constraints
- Do NOT change card layout or tag system
- Only modify text content fields

---

> ### 🛑 STOP — Present the execution plan above, then ask:
> **"Continue with the next phase?"**

---

## 🔵 PHASE 7 — Connect / Contact Section

### 🎯 Objective
Make the contact section feel more inviting and reduce friction for recruiters reaching out.

### 📌 Execution Plan (present this before executing)
1. Locate the Connect/Contact section component.
2. Add a **short headline** above the contact fields:
   > _"Let's build something together."_
3. Add a **subline** beneath it:
   > _"I'm currently open to full-time roles, project-based work, and freelance contracts — locally in the Philippines or fully remote."_
4. Add a **response time note** near the Schedule a Call button:
   > _"⚡ Usually responds within 24 hours."_
5. If there's no existing **availability status**, add one line:
   > _"🟢 Available — actively looking for opportunities."_

### ✅ Files likely to be modified
- `src/components/Connect.jsx` or equivalent contact section

### ⚠️ Constraints
- Do NOT change input field layout or button styles
- Text additions only — no new UI components

---

> ### 🛑 STOP — Present the execution plan above, then ask:
> **"Continue with the next phase?"**

---

## ✅ COMPLETION CHECKLIST

After all phases are done, Claude Code should verify:

- [ ] "Open to Work" badge visible on homepage hero
- [ ] "Open for:" service tags listed (Web, Mobile, AI/ML, Freelance, DevOps)
- [ ] "How I Build" workflow visible in About section
- [ ] Featured project descriptions updated with impact copy
- [ ] "Currently Building" label on active project
- [ ] Certifications page has "Currently Learning" section
- [ ] Experience entries have summary lines
- [ ] Blog excerpts updated to be more compelling
- [ ] Contact section has availability status + response time note
- [ ] No design changes were made (layout, colors, fonts, spacing all unchanged)
- [ ] No new components were created unless explicitly allowed

---

> **Final note to Claude Code:** If any data file structure does not support a new field (e.g., `summary`, `excerpt`), flag it and ask Peter before improvising. Always preserve the existing data schema.