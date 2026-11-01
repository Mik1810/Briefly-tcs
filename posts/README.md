# Posts

One file per day: `YYYY-MM-DD.json`, format `briefly-post/1` (see `src/lib/content/post.ts` on `main`).
Each push here runs `.github/workflows/publish-posts.yml`, which publishes new posts to Supabase and rebuilds
the site on Vercel. This branch is never deployed by Vercel itself (`vercel.json`).
