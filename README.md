# IPBALA — Balaji Loganathan Personal Website

A modern, minimalist, and fully responsive personal professional website for **Balaji Loganathan** — Intellectual Property Professional, Business Development &amp; Technology Enthusiast.

## Overview

This is a static single-page website built with plain HTML5, CSS3, and vanilla JavaScript. No frameworks or build tools are required.

### Sections

| Section | Description |
|---|---|
| **Home** | Hero with name, tagline, introduction, and social links |
| **About** | Professional background, skills, values, and areas of interest |
| **Experience** | Professional career timeline |
| **Conferences &amp; Events** | Conferences, seminars, workshops, and networking events |
| **Articles &amp; Insights** | Educational blog posts on IP, AI, technology, and innovation |
| **Resources** | Curated public IP &amp; technology references and official organisations |
| **Gallery** | Professional photographs from events and business activities |
| **Contact** | Email contact form and LinkedIn link |

### Design Features

- 🌙 Dark / Light mode with system preference detection and localStorage persistence
- 📱 Fully responsive — desktop, tablet, and mobile
- ♿ Accessible — semantic HTML5, ARIA labels, keyboard navigation, reduced-motion support
- ⚡ Fast — no JavaScript frameworks, no heavy dependencies
- 🔍 SEO-friendly meta tags and Open Graph support
- ✨ Smooth scroll-reveal animations via Intersection Observer API

## File Structure

```
IPBALA/
├── index.html          # Main single-page application
├── css/
│   └── style.css       # All styles (dark/light theme, responsive, animations)
├── js/
│   └── main.js         # Theme toggle, mobile nav, animations, form validation
├── assets/             # Place your professional headshot here
│   └── (headshot.jpg)  # Replace the SVG avatar in index.html with an <img> tag
├── .gitignore
└── README.md
```

## Adding a Professional Headshot

Locate the comment `<!-- Replace the SVG below with an <img> tag -->` in `index.html` (inside `.hero__avatar`) and replace the `<svg>` element with:

```html
<img src="assets/headshot.jpg" alt="Balaji Loganathan" width="220" height="220" />
```

## Contact Form

The form uses [FormSubmit](https://formsubmit.co/) for serverless form handling. Update the `action` attribute on `#contactForm` with your preferred email address:

```html
<form action="https://formsubmit.co/YOUR_EMAIL@example.com" method="POST">
```

## Disclaimer

This website is intended solely as a personal professional profile and educational platform. It does not offer legal services, solicit professional engagements, or provide advice of any kind.

---

&copy; Balaji Loganathan — All rights reserved.
