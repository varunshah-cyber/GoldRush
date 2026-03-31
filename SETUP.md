# GoldRush Quiz — Setup Guide
**From zero to live URL in under an hour.**

---

## What You'll Need
- A free Supabase account → supabase.com
- A free Vercel account  → vercel.com
- A free GitHub account  → github.com
- Node.js installed on your laptop (for local testing) → nodejs.org

---

## Step 1: Set Up Supabase (15 min)

1. Go to **supabase.com** → Sign up → **New Project**
2. Give it a name (e.g. `goldrush-quiz`) and a strong database password. Save that password somewhere safe.
3. Choose region: **Southeast Asia (Singapore)** — closest to India.
4. Wait ~2 minutes for it to spin up.
5. Once ready, click **SQL Editor** in the left sidebar.
6. Click **New query**, paste the entire contents of `supabase-schema.sql`, and click **Run**.
   - You should see "Success. No rows returned."
7. Go to **Settings → API** and copy two values:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public** key (a long JWT string)
8. Keep this tab open — you'll paste these into Vercel in Step 3.

---

## Step 2: Push to GitHub (5 min)

1. Go to **github.com** → **New repository** → name it `goldrush-quiz` → Create
2. On your laptop, open Terminal and run:

```bash
cd path/to/goldrush-quiz-folder
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/goldrush-quiz.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 3: Deploy on Vercel (5 min)

1. Go to **vercel.com** → Sign in with GitHub → **Add New Project**
2. Select the `goldrush-quiz` repository → **Import**
3. Vercel auto-detects it as a Vite project. Framework Preset = **Vite**. Leave everything else as is.
4. Expand **Environment Variables** and add:
   - `VITE_SUPABASE_URL` → paste your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY` → paste your Supabase anon key
5. Click **Deploy**.
6. In ~60 seconds, you'll get a live URL like `goldrush-quiz.vercel.app`

**That's it. Share the link with your friends and family.**

---

## Step 4: Enable Email Sign-ups in Supabase

By default Supabase asks users to verify their email. For a casual friends-and-family quiz, you probably want to skip that:

1. In Supabase → **Authentication → Providers → Email**
2. Toggle **"Confirm email"** to OFF
3. Save

Now users can sign up and play immediately without checking their email.

---

## Optional: Custom Domain

If you own a domain (e.g. `goldrushquiz.in`):
1. Vercel → your project → **Settings → Domains**
2. Add your domain and follow the DNS instructions.

---

## How the Quiz Works (Summary)

| Feature | How it works |
|---|---|
| Auth | Email + password via Supabase Auth |
| One attempt/day | `unique(user_id, quiz_date)` constraint in the DB |
| Quiz timing | IST date computed client-side; server stores it |
| Score submission | Writes to `daily_attempts` table |
| Leaderboard | Reads `daily_attempts` ordered by score↓, time↑ |
| Monthly board | Aggregates `points` from all attempts in the month |
| Ranking | Score then fastest time; points: 10/8/6/3/1 |

---

## Adding New Questions

The question bank is inside `src/App.jsx`, in the `QUESTION_BANK` array. Each question looks like:

```js
{ id: 51, cat: "Personal Finance", q: "Your question here?",
  opts: ["Option A", "Option B", "Option C", "Option D"], ans: 1 },
//                                                         ^
//                              0-indexed index of the correct answer
```

Categories must be one of:
- `"Personal Finance"`
- `"Markets & Investing"`
- `"Economics"`
- `"Current Affairs"`

After editing, just `git push` — Vercel auto-redeploys in under a minute.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Blank page after deploy | Check Vercel → Functions logs for errors |
| "Invalid API key" error | Double-check VITE_ env vars in Vercel settings |
| Can't sign up | Make sure "Confirm email" is OFF in Supabase Auth settings |
| Score not saving | Check Supabase → Table Editor → daily_attempts; RLS might need a policy refresh |
| Leaderboard empty | Normal on day 1 — plays appear after first submission |

---

## Monthly Maintenance

At the end of each month, the monthly leaderboard resets automatically (it queries the current month). No action needed.

If you want to add or change questions, edit the `QUESTION_BANK` array in `App.jsx` and push.

---

## Cost

| Service | Free tier | Your usage |
|---|---|---|
| Supabase | 500MB DB, 50k auth users | Will last years at family scale |
| Vercel | 100GB bandwidth/month | Will last years at family scale |
| GitHub | Unlimited public repos | Free forever |

**Total monthly cost: ₹0** until you scale to hundreds of daily active users.
