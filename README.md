# Responsible AI Integration PD — Netlify Deployment

This is the same course site you tested on Claude, rebuilt to run on your
own Netlify site instead. Participant progress, reflections, scenario
submissions, and discussion posts are now saved using **Netlify Blobs**
(Netlify's own built-in storage) instead of Claude's storage — so nothing
about this depends on Anthropic's platform or requires participants to
have any kind of account.

## What's in this folder

- `index.html` — the whole course site (content, styling, and behavior)
- `netlify/functions/storage.mts` — a small serverless function that saves
  and loads data using Netlify Blobs. The page talks to this function;
  you shouldn't need to edit it.
- `netlify.toml` — tells Netlify where the site and function live
- `package.json` — lists the one dependency (`@netlify/blobs`) the function needs

## One-time setup

1. **Create a free Netlify account** at netlify.com if you don't have one.
2. **Put this folder in a GitHub repository.**
   - Easiest path: create a new (private is fine) repo on GitHub, then
     upload these files to it (GitHub's web "Add file > Upload files" works
     fine — you don't need git installed).
3. **In Netlify: "Add new site" → "Import an existing project"** and
   connect that GitHub repo.
4. **Build settings** — leave the build command blank. Publish directory
   should be `.` (it'll likely detect this automatically from `netlify.toml`).
5. **Deploy.** Netlify will run `npm install` (pulling in `@netlify/blobs`),
   detect the function automatically, and give you a live URL like
   `https://your-site-name.netlify.app`.

That's it — no separate database to create, no API keys to configure.
Netlify Blobs is provisioned automatically per site.

## Before real participants use it

1. **Edit `index.html`'s CONFIG block** the same way you've been doing —
   add the four module video links and change `adminPassword` from
   `changeme123` to something real. Push the change to GitHub; Netlify
   redeploys automatically.
2. **Test it yourself end-to-end** on the live `.netlify.app` URL: enter a
   test participant code, save a reflection, save scenario work, post a
   discussion comment, then open the researcher dashboard and confirm you
   can see and export all three (progress, submissions, discussion).
3. **Tell your IRB where the data actually lives now**: Netlify Blobs, on
   Netlify's infrastructure, under your Netlify account — not Google,
   Microsoft, Canvas, or Anthropic. Worth stating plainly in your protocol.
4. The admin dashboard password is still a simple client-side check —
   fine for keeping casual visitors out, but not a substitute for treating
   your `.netlify.app` URL and dashboard password as things you don't
   share outside your participant list and yourself.

## If something doesn't save

Open your browser's developer console (F12) on the live site and check for
red errors when you click "Save my work" or similar. The most common cause
would be the function failing to deploy — check Netlify's "Functions" tab
in your site dashboard to confirm `storage` shows up and has no build errors.
