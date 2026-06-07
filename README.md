# Wasla · وصلة — Project Web Hub

> **Your Smart Subscription Hub — Track, Manage & Save**
> مركز اشتراكاتك الذكي — تتبع، أدر، ووفر

A bilingual (Arabic-first, RTL) Human–Computer Interaction (HCI) senior project
from **Umm Al-Qura University, College of Computing** — Software Engineering,
HCI track. Built with Flutter + Firebase, validated with 221 survey participants
and 5 think-aloud usability testers.

This repository hosts the **web companion** for the Wasla mobile app: a landing
page, a 12-slide cinematic presentation, and full technical documentation.

---

## 🚀 Live Pages

| Page | URL | Purpose |
|------|-----|---------|
| Hub / Landing | `/` | Marketing page with hero, problem, solution, features, screens carousel, team, footer |
| Presentation | `/presentation` | 12-slide deck, keyboard navigable, autoplay, fullscreen |
| Documentation | `/docs` | Technical documentation with sidebar nav, code blocks, file tree, data model, research, accessibility |
| Rewrites | `/hub`, `/docs`, `/presentation` | Friendly aliases |

> Deploy on **Vercel** — `vercel.json` ships with clean URLs and cache headers.

---

## 🗂 Project Structure

```
web/
├── index.html              ← landing / hub
├── presentation.html       ← 12-slide deck
├── docs.html               ← technical documentation
├── vercel.json             ← Vercel clean URLs + cache headers
├── README.md
│
├── css/
│   ├── style.css           ← shared design system (Wasla brand, animations, components)
│   ├── presentation.css    ← deck-specific styles
│   └── docs.css            ← documentation-specific styles
│
├── js/
│   ├── main.js             ← shared: nav, scroll-reveal, counters, particle canvas, carousel, parallax
│   ├── presentation.js     ← deck controller: keyboard nav, autoplay, fullscreen
│   └── docs.js             ← docs: active link, back-to-top, copy code, heading numbers
│
└── assets/
    └── screens/            ← real phone screenshots (JPEG)
        ├── 01-login.jpeg
        ├── 02-signup.jpeg
        ├── 03-home.jpeg
        ├── 03b-home-en.jpeg
        ├── 04-dashboard.jpeg
        ├── 05-add-subscription.jpeg
        ├── 06-details.jpeg
        ├── 07-cancellation.jpeg
        ├── 08-chatbot.jpeg
        ├── 09-profile.jpeg
        ├── 09b-profile-en.jpeg
        ├── 11-offers.jpeg
        ├── 12-accessibility.jpeg
        └── uqu-logo.png
```

The mobile Flutter app source lives in a separate repository
(`wasla-app/`). This repository is **only** the web companion.

---

## 🎨 Brand

| Token | Value | Usage |
|-------|-------|-------|
| Primary Dark | `#420691` | Headers, login / signup background |
| Primary | `#502c96` | Buttons, active states |
| Primary Accent | `#56369c` | Hover states, gradients |
| Dark Blue | `#0C3571` | Deep backgrounds |
| Accent Orange | `#E84A2C` | Cancellation, Netflix offer |
| Accent Blue | `#0A6B8A` | Fitness offer |
| Accent Green | `#2E8B57` | Success states |
| Accent Gold | `#FFB13B` | CTAs, highlights |

**Gradients**

```css
/* Hero */         linear-gradient(135deg, #420691 0%, #56369c 50%, #0C3571 100%);
/* Auth */         linear-gradient(180deg, #420691 0%, #502c96 50%, #0C3571 100%);
/* Dark section */ linear-gradient(180deg, #420691 0%, #0C3571 100%);
```

**Fonts:** `Inter` (English) + `Cairo` (Arabic), both from Google Fonts.

---

## ✨ Key Effects

- **Particle canvas** in the hero (Canvas 2D, 100 / 50 particles, mouse repel)
- **3D perspective** on the entire page (`perspective: 1200px`)
- **3D card tilts** on hover (`rotateY`, `rotateX`, `translateZ`)
- **3D phone mockup** in the hero with reflection shine
- **Orbit hub** animation on the solution page (4 orbiting nodes, SVG guides)
- **3D carousel** for the 12 screens (auto-play, 4s, prev / next dots)
- **Scroll-triggered reveal** with `IntersectionObserver`
- **Animated counters** with `requestAnimationFrame` and ease-out cubic
- **Mesh gradient** background that animates
- **Glowing orbs** blurred behind hero / footer
- **Reduced-motion** support (`prefers-reduced-motion`)

---

## ⌨️ Presentation Shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` / `PageDown` | Next slide |
| `←` / `PageUp` | Previous slide |
| `1`–`9` | Jump to slide N |
| `Home` / `End` | First / last slide |
| `F` | Toggle fullscreen |
| `Esc` | Exit fullscreen |
| Click a dot (right rail) | Jump to slide |
| Tap-and-swipe (mobile) | Navigate |

---

## 🛠 Local Development

The whole site is **static** — no build step is required.

```bash
# Option 1 — open directly
open web/index.html

# Option 2 — serve locally (any static server)
cd web
npx serve .
# or
python -m http.server 8080
```

Then visit:

- `http://localhost:8080` — hub
- `http://localhost:8080/presentation` — deck
- `http://localhost:8080/docs` — documentation

---

## 🚀 Deploying on Vercel

The `vercel.json` is pre-configured with:

- **Clean URLs** (no `.html` in the URL)
- **Rewrites** (`/`, `/presentation`, `/docs`, `/hub`)
- **Security headers** (X-Frame-Options, Referrer-Policy, Permissions-Policy)
- **Long-lived caching** for `/assets/*`, `*.css`, `*.js`

```bash
# From the project root
vercel --prod
```

Or use the Vercel dashboard → "New Project" → import this repository → Framework
preset: **Other** → Output directory: `web`.

---

## ♿ Accessibility

- **WCAG 2.1 AA &amp; AAA** verified for the primary palette (19.41, 11.56, 15.42, 12.57)
- Semantic HTML, ARIA labels on interactive icons
- All animations disabled with `prefers-reduced-motion: reduce`
- `lang` and `dir` toggled by the language switcher
- `role`, `aria-label` on carousel controls, slide dots, fullscreen, to-top
- Keyboard navigable everywhere (links, buttons, focus visible)

---

## 🧪 Test Account (mobile app)

| Field | Value |
|-------|-------|
| Email | `testuser@gmail.com` |
| Password | `123A321` |

---

## 👥 Team

| Name | ID | Role |
|------|----|------|
| Ghadi Shaker Al-Fadhli | 444000760 | Team Lead / Frontend |
| Kholoud Sultan Al-Otaibi | 444005515 | UI/UX Designer / Researcher |
| Elaf Ahmad Almaymani | 443008696 | Backend Developer |
| Maryam Zainalabidin Fatani | 444006766 | QA / Testing |
| Khadijah Ahmed Azab | 444001406 | Documentation / Content |
| Suha Abdulrahman Turkistani | 444006390 | AI / Chatbot Developer |

**Supervisor:** Dr. Reem Saleh Alashaikh
**University:** Umm Al-Qura University
**College:** Computing — Software Engineering — Human Computer Interaction
**Academic Year:** 2025–2026

---

## 📝 License

This project is part of a university senior project. All rights reserved by the Wasla team
and Umm Al-Qura University.

---

<p align="center"><strong>وصلة</strong> · <em>Your smart subscription hub</em></p>
