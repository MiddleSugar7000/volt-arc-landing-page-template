<!--
  VOLT Arc — free cinematic landing page template (HTML, GSAP, Lenis, Three.js). MIT licensed.
  Made by MiddleSugar7000, freelance full-stack developer: https://middlesugar7000.xyz
-->

<a href="https://middlesugar7000.github.io/volt-arc-landing-page-template/">
  <img src=".github/assets/hero.svg" alt="VOLT Arc — free dark cinematic landing page template for product launches, built with HTML, GSAP, Lenis and Three.js" width="100%">
</a>

<p align="center">
  <a href="https://middlesugar7000.github.io/volt-arc-landing-page-template/"><img src=".github/assets/btn-demo.svg" alt="Live demo" height="56"></a>&nbsp;
  <a href="https://github.com/MiddleSugar7000/volt-arc-landing-page-template/generate"><img src=".github/assets/btn-use.svg" alt="Use this template" height="56"></a>&nbsp;
  <a href="https://github.com/MiddleSugar7000/volt-arc-landing-page-template/archive/refs/heads/main.zip"><img src=".github/assets/btn-download.svg" alt="Download ZIP" height="56"></a>
</p>

<p align="center">
  <img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-C6FF00?style=flat-square&labelColor=0A0A0B">
  <img alt="No build step" src="https://img.shields.io/badge/build-none%20needed-EDEDE8?style=flat-square&labelColor=0A0A0B">
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-ScrollTrigger-C6FF00?style=flat-square&labelColor=0A0A0B">
  <img alt="Three.js" src="https://img.shields.io/badge/Three.js-procedural%203D-EDEDE8?style=flat-square&labelColor=0A0A0B">
  <a href="https://middlesugar7000.xyz"><img alt="Made by MiddleSugar7000" src="https://img.shields.io/badge/made%20by-MiddleSugar7000-C6FF00?style=flat-square&labelColor=0A0A0B"></a>
</p>

# VOLT Arc — Free Dark Landing Page Template (HTML + GSAP + Three.js)

**VOLT Arc is a free, MIT-licensed, single-file landing page template for product launches.** It's a dark, cinematic, scroll-driven page for a fictional 204 hp electric hypersport motorcycle, with smooth scrolling (Lenis), scroll animations (GSAP ScrollTrigger), a procedurally generated Three.js electric motor and six product renders included. Open `index.html` and it runs: no framework, no npm, no build step.

Use it for an EV, hardware product, gadget, car, SaaS launch, pre-order or waitlist page. Swap the copy and images and you have a premium launch page in an afternoon.

> 🛠️ **Want one built for your own product?** This template was designed and coded by **[MiddleSugar7000](https://middlesugar7000.xyz)**, a freelance full-stack developer. Custom landing pages from **$450**, delivered in 48–72 hours. **[Hire me →](https://middlesugar7000.xyz/#contact)**

---

## Contents

- [Features](#features)
- [Quick start](#quick-start)
- [Customize it](#customize-it)
- [Page sections](#page-sections)
- [Tech stack](#tech-stack)
- [FAQ](#faq)
- [License](#license)
- [Need a custom landing page?](#need-a-custom-landing-page)

## Features

<img src=".github/assets/features.svg" alt="Template features: GSAP ScrollTrigger and Lenis smooth scroll, procedural Three.js motor, 6 product renders, no build step, interactive drive modes, MIT license" width="100%">

- **Single HTML file.** All markup, CSS and JS in `index.html`; the 3D motor lives in `assets/motor.js`.
- **Smooth, weighted motion.** Lenis smooth scroll, GSAP ScrollTrigger reveals, rolling stat counters and scroll-scrubbed sections.
- **Procedural 3D.** An axial-flux electric motor built entirely in Three.js code, no 3D model files.
- **Interactive bits.** Drive-mode switcher (Rain / Road / Track) and a "hold to launch" 0–100 km/h demo.
- **Six product images included** in `assets/` (WebP for the page, PNG originals for editing).
- **Noir design system.** Near-black surfaces, one lime accent (`#C6FF00`), Clash Display + Satoshi typography, hairline borders.
- **Responsive and accessible.** Fluid `clamp()` type, mobile layouts, and `prefers-reduced-motion` support.
- **SEO-ready.** Semantic headings, meta description, theme color and preloaded hero image.

## Quick start

```bash
git clone https://github.com/MiddleSugar7000/volt-arc-landing-page-template.git
cd volt-arc-landing-page-template
```

Open `index.html` directly, or serve the folder (recommended, because the Three.js module uses an import map):

```bash
npx serve .
```

**Deploy for free:** push to GitHub and enable **GitHub Pages**, or drag the folder into Netlify, Vercel or Cloudflare Pages.

## Customize it

| What | Where |
| --- | --- |
| Colors, radii, easing | CSS variables on `:root` in `index.html` (`--bg`, `--text`, `--lime`, `--r-card`…) |
| Fonts | The Fontshare `<link>` in `<head>` (Clash Display + Satoshi) |
| Copy, specs and prices | Plain HTML in `index.html` |
| Images | Replace files in `assets/` and keep the same names, or update the `src` attributes |
| 3D motor | `assets/motor.js` (Three.js, procedural geometry) |
| Accent color | Change `--lime` once and the whole page follows |

## Page sections

1. **Preloader** with a rolling percentage counter
2. **Hero** — "Violent." headline over the hero render
3. **Motor** — the procedural Three.js axial-flux motor
4. **Performance** — animated stats (204 hp, 240 Nm, 0–100 km/h)
5. **Ride** — full-bleed cinematic imagery
6. **Technology** — battery-as-chassis story, 150 kW DC charging, range
7. **Drive modes** and **Hold to launch** interaction
8. **Reserve** — pre-order / deposit call to action

## Tech stack

HTML5 · CSS (custom properties) · JavaScript (ES modules) · [GSAP 3](https://gsap.com) + ScrollTrigger · [Lenis](https://lenis.darkroom.engineering) · [Three.js](https://threejs.org) · Phosphor Icons · Fontshare fonts. All loaded from CDNs.

## FAQ

**Is this landing page template really free?**
Yes. VOLT Arc is released under the MIT license, so you can use it for personal and commercial projects, modify it and ship it. Keeping the license notice is the only requirement.

**Do I need React, Next.js or a build tool?**
No. It's a plain HTML/CSS/JS template. Open `index.html` or host the folder on any static host.

**What kind of product is it good for?**
Any launch that benefits from a dark, cinematic look: electric vehicles, hardware, gadgets, cars, AI products, SaaS launches, pre-orders and waitlists.

**Can I use the included images?**
Yes. The six renders in `assets/` ship with the template and can be used with it. Replace them with your own product shots for production.

**Who made this template?**
[MiddleSugar7000](https://middlesugar7000.xyz), a freelance full-stack developer who builds custom landing pages, SaaS products, APIs and AI integrations.

**Can you build a custom version for my business?**
Yes. Custom landing pages start at $450 and are typically delivered in 48–72 hours, with a fixed quote within 24 hours and no calls required. [Get in touch](https://middlesugar7000.xyz/#contact).

## License

[MIT](LICENSE) © MiddleSugar7000. A ⭐ or a link back to [middlesugar7000.xyz](https://middlesugar7000.xyz) is appreciated, never required.

## Need a custom landing page?

<a href="https://middlesugar7000.xyz/#contact">
  <img src=".github/assets/hire.svg" alt="Want one built for your product? Hire MiddleSugar7000, freelance full-stack developer. Custom landing pages from $450, SaaS MVPs and AI integrations." width="100%">
</a>

<p align="center">
  <a href="https://middlesugar7000.xyz/#contact"><img src=".github/assets/btn-hire.svg" alt="Hire me" height="56"></a>&nbsp;
  <a href="https://middlesugar7000.xyz"><img src=".github/assets/btn-portfolio.svg" alt="My portfolio" height="56"></a>
</p>

I'm **MiddleSugar7000**, a freelance full-stack developer. I design and build:

- **Custom landing pages** — from $450, 48–72 hours
- **Web apps and SaaS MVPs** — auth, PostgreSQL, Stripe / Dodo Payments / Whop checkout, from $950
- **APIs and AI integrations** — OpenAI, Anthropic Claude, Gemini, from $650

Text-only communication (Discord, Telegram, email or X), fixed quotes, weekly previews, and you own 100% of the code.

🌐 [middlesugar7000.xyz](https://middlesugar7000.xyz) · ✈️ [Telegram](https://t.me/middlesugar7000) · 💬 Discord: `middlesugar7000.main` · 📧 [middlesugar700@gmail.com](mailto:middlesugar700@gmail.com)

<p align="center"><sub>Keywords: free landing page template, dark landing page template, product launch page, HTML GSAP template, Three.js landing page, Lenis smooth scroll, electric motorcycle website template, EV landing page, pre-order page template, MIT website template.</sub></p>

<!-- update: v1 -->
<!-- update: v2 -->
<!-- sync: 2026-10-08-r1 -->
<!-- sync: 2026-10-08-r2 -->
