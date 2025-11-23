# 🔄 Knowledge Transfer: From Prototype to Production

**Target Audience:** Senior Engineers / Backend Developers  
**Goal:** Port the Kargo Kopilot React Prototype to a Scalable Next.js App.

---

## 📦 Package Overview

We have built a **High-Fidelity Prototype**. It looks and feels like the real app, but the "Backend" is currently running in the browser's memory.

### What to Keep (Frontend)
1.  **Polaris UI Implementation:** The `Card`, `Button`, and Layout components are solid. They perfectly mimic Shopify's native look.
2.  **Gemini Prompts:** The prompt engineering in `services/geminiService.ts` is tuned and works well.
3.  **Batch UX:** The user flow (Select Orders -> Sticky Header -> Progress Page) is validated and smooth.

### What to Change (Backend Migration)

#### 1. The Batch Service (`services/batchService.ts`)
*   **Current:** In-memory array + `setTimeout` loop.
*   **Production:**
    *   **Database:** Create a `batches` and `batch_items` table in Supabase.
    *   **Queue:** Use **BullMQ** or **Inngest** on the server.
    *   **API:** Create an endpoint `POST /api/batch/create` that accepts IDs.

#### 2. The Gemini Service (`services/geminiService.ts`)
*   **Current:** Direct client-side call using API Key.
*   **Production:**
    *   Create a Next.js Route Handler: `app/api/classify/route.ts`.
    *   Move the API Key to server-side env vars.
    *   Implement rate limiting (Redis-backed) here to prevent API abuse.

---

## 🎓 Top Lessons Learned

### 1. User Perception of Speed
We added artificial delays in the batch processor. Interestingly, **too fast** feels fake to users. A 500ms-1.5s delay per item feels "industrious" and builds trust in the AI's work.

### 2. Optimistic UI
In `Orders.tsx`, when a user clicks "Process", we immediately redirect them to `Batch.tsx`. We don't wait for the server to confirm the job creation. This makes the app feel instant.

### 3. Handling AI Hallucinations
The `ClassificationResult` type includes `reasoning`. **Always display this.** Users trust the HS code 100% more if they see *why* the AI picked it (e.g., "Selected 6403.91 because the description mentions leather upper").

---

## 📋 Pre-Build Checklist (For V2)

- [ ] Set up Supabase project (PostgreSQL).
- [ ] Configure Shopify Partner Dashboard (App Bridge).
- [ ] Set up Vercel project for Next.js hosting.
- [ ] Copy `components/` folder to new project.
- [ ] Copy `services/geminiService.ts` logic to Server Action.

---

## 🤖 Cursor/Claude Prompt for Migration

*Use this prompt when starting the V2 codebase:*

> "I am migrating a React prototype to Next.js 14 (App Router). I have a `batchService.ts` file that currently simulates a queue in-memory using an Observer pattern. Please convert this logic into a Supabase + Next.js API Route implementation. Create a database schema for `BatchJob` and `BatchItem`, and write a robust API route that handles the queue processing using Inngest or a simple cron-based approach."
