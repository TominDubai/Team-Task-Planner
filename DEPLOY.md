# Publish & invite your team

I can’t log into your Vercel or Supabase accounts from here. Follow **one** of the paths below; total time is about **10–15 minutes** the first time.

---

## Before you start

- App folder: **`formed-design-planner`** (use this folder only for the Git repo — not your whole Google Drive).
- You already have a **Supabase project** and have run **`supabase/schema.sql`** on it.

---

## Part A — Put the app on Vercel (recommended)

### Option 1: GitHub + Vercel (best for ongoing updates)

1. **Create a new GitHub repo** (empty), e.g. `Team-Task-Planner`.
2. In a terminal, from **this project folder** (not the whole Drive):

   ```powershell
   git init
   git add .
   git commit -m "Initial commit — Formed Design planner"
   git branch -M main
   ```

   Add GitHub as `origin` using **your** repo URL (from the empty repo’s “Quick setup” page — replace `yourname` and `your-repo`):

   ```powershell
   git remote add origin https://github.com/yourname/your-repo.git
   ```

   If `error: remote origin already exists`, fix the URL instead:

   ```powershell
   git remote set-url origin https://github.com/yourname/your-repo.git
   ```

   Then push:

   ```powershell
   git push -u origin main
   ```

3. Go to [vercel.com](https://vercel.com) → sign in with GitHub → **Add New… → Project** → import **that same repo** (e.g. `yourname/your-repo` — yours might look like `TominDubai/Team-Task-Planner`).
4. Under **Environment Variables**, add:

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | From Supabase → Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase → Settings → API → `anon` `public` key |

5. Click **Deploy**. When it finishes, copy your production URL, e.g. `https://formed-design-planner.vercel.app`.

### Option 2: Vercel CLI (no Git, quick test)

From this folder:

```powershell
npx vercel@latest login
npx vercel@latest
```

Answer the prompts (link to a Vercel account). When asked for env vars, paste the same two as above. Then for production:

```powershell
npx vercel@latest --prod
```

Use the URL Vercel prints.

---

## Part B — Supabase (so login works on the live site)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. **Authentication** → **URL Configuration**:
   - **Site URL:** your Vercel URL, e.g. `https://formed-design-planner.vercel.app`
   - **Redirect URLs:** add:
     - `https://formed-design-planner.vercel.app/**`
     - `https://formed-design-planner.vercel.app/auth/callback`  
     (Replace with your exact domain.)

3. If you use **email confirmation**, users must confirm from an email; the link must use this same site URL.

---

## Part C — Invite the team

**Open signup (what you have now)**

- Share: **“Go to `https://YOUR-VERCEL-URL` and sign up.”**
- Each person gets a **profile** automatically (trigger + `ensureProfile`).

**Make someone an admin (Manager Portal)**

- Supabase → **Table Editor** → `profiles` → set **`role`** to `admin` for that user.

**Optional: restrict who can sign up**

- Supabase → **Authentication** → **Providers** → consider disabling public signups and adding users manually under **Authentication → Users**, or add email-domain checks later in SQL/app.

---

## If Vercel says “Build Failed” (`npm run build` exited with 1)

1. Open the failed deployment → **Build Logs** and scroll to the **first red error** (that line is what matters).
2. **Pull the latest code** from this repo: we removed duplicate `next.config.ts` (Next 14 + Vercel can choke on it), added `.eslintrc.json`, and set `eslint.ignoreDuringBuilds` in `next.config.mjs` so the build doesn’t hang on lint setup.
3. On Vercel → **Settings → Environment Variables**: add **`NEXT_PUBLIC_SUPABASE_URL`** and **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** for **Production** (and Preview if you use previews). Redeploy.
4. **Root Directory**: leave blank unless this app lives in a subfolder inside the repo (then set that folder, e.g. `formed-design-planner`).
5. **Node.js version:** This app pins **`20.x`** in `package.json` → `engines`. If Vercel still shows **24.x**, open **Project → Settings → General → Node.js Version** and set **20.x**, then redeploy. Next.js 14 often breaks on bleeding-edge Node.

---

## Checklist

- [ ] Vercel project deployed with both `NEXT_PUBLIC_*` variables set  
- [ ] Supabase **Site URL** + **Redirect URLs** use the real Vercel domain  
- [ ] You opened the live URL and signed up / logged in successfully  
- [ ] Admins have `role = admin` in `profiles`  

---

## If the live site shows “failed to fetch”

- Confirm env vars on Vercel (no typos, no quotes around values).  
- **Redeploy** after changing env vars (Vercel → Deployments → … → Redeploy).
