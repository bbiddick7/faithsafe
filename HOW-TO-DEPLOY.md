# How to Put Your Reflection Tool Online

A step-by-step guide written for someone who has **never** done this before.
Total time: about 20–30 minutes. You will need a computer (Mac or Windows) and internet.

When you finish, your tool will have a real web address (like `your-tool.netlify.app`)
that anyone in the world can open.

---

## What you have

You downloaded a folder called **`sentinel-tool`**. This is your whole project. Do not
worry about what is inside it — you only need to run a couple of commands and it turns
into a website.

There are three parts to this:

1. **Install one free program** (Node.js) — the engine that builds your website.
2. **Build the website** — two commands you type.
3. **Put it online** — drag one folder onto a free website.

Follow the steps in order. Type the commands exactly, then press Enter.

---

## PART 1 — Install Node.js (one time only)

Node.js is a free program that turns your project folder into a real website.

1. Go to **https://nodejs.org**
2. Click the big green button that says **“LTS”** (it may say something like “20.x.x LTS”).
   LTS just means “the stable version.” Download it.
3. Open the file you downloaded and click **Next / Continue / Agree** through the
   installer until it says it’s done. Accept all the default options.
4. **Restart your computer.** (This matters — it lets your computer find the new program.)

> ✅ That’s the only thing you ever have to install.

---

## PART 2 — Open the “Terminal” and go to your folder

The Terminal is a window where you type commands. It looks plain, but you only need 3 commands total.

### On a Mac
1. Press **Command (⌘) + Spacebar**, type **Terminal**, press **Enter**.
2. A small window opens. Leave it for a second.

### On Windows
1. Click the **Start** menu, type **PowerShell**, press **Enter**.
2. A small window opens. Leave it for a second.

### Now point the Terminal at your project folder
This is the part beginners find fussy, so here’s the easy trick:

1. In the Terminal window, type this **exactly**, including the space after `cd`, but do
   **not** press Enter yet:
   ```
   cd 
   ```
   (That’s the letters c, d, then a space.)
2. Find your **`sentinel-tool`** folder on your computer (for example in Downloads).
3. **Drag that folder** directly into the Terminal window and let go. The Terminal will
   automatically fill in its location for you.
4. Now press **Enter.**

> You are now “inside” your project folder. You won’t see much change — that’s normal.

---

## PART 3 — Build your website (two commands)

Type these one at a time. Press **Enter** after each, and **wait** for it to finish
(the blinking cursor returns) before typing the next.

**Command 1 — set up the pieces (takes 1–2 minutes):**
```
npm install
```
You’ll see a lot of text scroll by. That’s normal. Wait until it stops.

**Command 2 — build the website (takes about 10 seconds):**
```
npm run build
```
When it finishes, a new folder named **`dist`** appears inside your project folder.

> 🎉 **That `dist` folder IS your website.** You’re ready to put it online.

---

## PART 4 — Put it online for free (the easy way)

We’ll use **Netlify**. It’s free, it’s reputable, and it lets you put a site online by
**dragging one folder** — no accounts-and-passwords maze, no commands.

1. Go to **https://app.netlify.com/drop**
   (This is Netlify’s “drag a folder here” page.)
2. You’ll see a large dotted box that says you can drag a site folder to deploy it.
3. Open your **`sentinel-tool`** folder and find the **`dist`** folder inside it.
4. **Drag the `dist` folder** into that dotted box on the Netlify page and let go.
5. Wait about 15 seconds. Netlify gives you a live web address, something like
   `https://shiny-name-123456.netlify.app`.

**That web address is your live tool. Open it. Share it. It works.**

> Netlify may ask you to create a free account to keep the site permanently. Do it —
> it’s free and takes a minute. Without an account the site still works but may expire.

---

## PART 5 (optional) — Make the web address nicer

The random name (`shiny-name-123456`) can be changed.

1. Create your free Netlify account (if you haven’t).
2. In your site’s dashboard, look for **“Site configuration”** or **“Domain
   management,”** then **“Change site name.”**
3. Pick something clear, like `faith-reflection`. Your address becomes
   `https://faith-reflection.netlify.app`.

Want a fully custom address you own (like `www.yourname.org`)? That requires buying a
domain name (about $10–15/year from a registrar). Netlify has a “Add a domain” button
that walks you through connecting one. This is optional and can wait.

---

## How to update the tool later

If you ever change the tool and want to update the live site:

1. Open the Terminal, point it at your folder again (the `cd` + drag trick from Part 2).
2. Run `npm run build` again. This makes a fresh `dist` folder.
3. Go to **https://app.netlify.com/drop** and drag the new `dist` folder in again
   (or, from your site dashboard, use the “Deploys” tab and drag it there to update the
   same address).

That’s it.

---

## If something goes wrong

- **“npm: command not found” (or “not recognized”)** → Node.js isn’t installed or you
  didn’t restart. Redo Part 1 and restart your computer.
- **The Terminal seems stuck after `npm install`** → It’s probably still working. Give it
  a few minutes. As long as text appeared, it’s fine.
- **You typed a command in the wrong place** → Close the Terminal, open a new one, and
  redo the `cd` + drag step from Part 2.
- **Netlify shows a blank page** → Make sure you dragged the **`dist`** folder itself,
  not the whole `sentinel-tool` folder.

---

## Two important reminders before you share it widely

1. **Get a professional to review it first.** Before promoting this to people who may be
   in distress, have a licensed therapist or counselor (ideally one familiar with
   religious trauma) read through the questions and the result tiers. This is the
   responsible step for any public mental-health-adjacent tool.

2. **Privacy is built in, but say so.** The tool stores nothing and tracks no answers —
   that’s already true and there’s a privacy note at the bottom of the page. Keep that
   note there so users know they’re safe.

---

You did it. A real tool, online, helping real people. That’s a meaningful thing to build.
