# Sahayak AI — Accessible Public-Service Form Assistant & Extension Bridge
**Built by Team Technologia** | *Startup Innovation Challenge 2026 (Theme 4: Open Innovation)*

## Live Project Links
- **Live Web Application (Vercel):** https://sahayak-ai-one-delta.vercel.app/
- **Interactive Pitch Deck:** https://mobnkeydluffy.github.io/sahayak-ai/pitch.html
- **GitHub Repository:** https://github.com/MobnkeyDLuffy/sahayak-ai

---

## Problem Statement
Every year, 35–40% of student scholarship applications and citizen certificate requests get delayed or rejected due to confusing legal jargon, missing attachments, and incomplete fields. Because official forms are difficult to interpret, students and everyday citizens are often forced to pay middlemen ₹100–₹200 per form just to understand basic requirements.

## Our Solution
**Sahayak AI** is a bilingual, zero-hallucination public-service form assistant and Chrome Extension ecosystem that simplifies government forms before submission:
- **Plain-Language Bilingual Guide:** Translates complex legal fields into everyday **English and हिन्दी (Hindi)** with `(i)` plain-language explanations.
- **Zero-Hallucination Rule Engine:** Explains verified official guidelines strictly from structured rule-schemas without inventing eligibility rules.
- **Chrome Extension Form Ingestion & Auto-Fill Bridge:** Simulates scanning multi-page government portals to extract required fields and documents into our verified database, and syncs completed profiles for 1-click auto-fill on official portals.
- **Live Document Checklist & Pre-Submission Validator:** Dynamically tracks required attachments and highlights missing required fields in red before generating a clean, printable summary draft.

---

## System Architecture
![Sahayak AI System Architecture](./architecture.png)

1. **Citizen / Operator Input:** Selects public-service form and language preference (`English` / `हिन्दी`).
2. **Rule-Verified Guide Engine:** Maps complex legal terminology to plain-language explanations using structured JSON schemas.
3. **Live Validation & Checklist:** Tracks required supporting documents and catches empty/invalid fields in real time.
4. **Clean Draft & Extension Sync:** Generates an error-free application summary and syncs verified data for 1-click portal auto-fill.

---

## Tech Stack
- **Frontend Framework:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **AI & Schema Extraction:** Google Gemini LLM (Structured JSON Rule Extraction)
- **Extension Architecture:** Chrome Extension Manifest V3 (DOM Parsing & Auto-Fill Sync)
- **Deployment & Hosting:** Vercel & GitHub

---

## Setup & Installation Instructions (Run Locally)

1. **Clone the repository:**
   ```bash
   git clone https://github.com.git
   cd sahayak-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:** Visit `http://localhost:5173` (or run `npm run build` to generate the production build).

---

## Team Technologia
- **BSc IT (1st Semester)** — Product Architecture, Frontend Development, Research & Pitch
