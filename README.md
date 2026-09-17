# Yousef Hassna — Portfolio

Personal portfolio site. Static HTML, CSS, and vanilla JavaScript, no build step and no framework.

## Structure

```
index.html                   Home page (hero, about, skills, projects, contact)
projects/
  dt-maturity-tool.html      Case study: Digital Transformation Maturity Tool
  security-auditor.html      Case study: Security Headers & TLS Auditor
  lamma-trivia.html          Case study: Lamma live trivia game
assets/
  css/style.css              Design tokens and all styling
  js/main.js                 Scroll reveal, theme toggle, scrollspy, image loading
  img/                       Project screenshots (WebP) and the OG share card
favicon.svg, favicon-32.png, apple-touch-icon.png
robots.txt, sitemap.xml
```

## Local development

No install needed. Serve the folder with any static file server, for example:

```
python3 -m http.server 8080
```

then open `http://localhost:8080/`.

## Notes

- Dark mode follows the system preference by default; the toggle in the nav overrides it and persists the choice in `localStorage`.
- Project screenshots are served as WebP with explicit dimensions to avoid layout shift, and fade in from a skeleton placeholder as they load.
- All motion respects `prefers-reduced-motion`.
