# GrandArchives

The hub of the GrandArchives guides to big fiction universes.

- Portuguese (pt-BR): https://grand-archives.github.io/
- English: https://grand-archives.github.io/en/

## What it is

GrandArchives gathers content aggregators about big fiction universes: stories, characters, places and the connections between them, organized in one place and easy to browse. No ads. Every source consulted is credited on each site.

This repository is the landing page of the organization. It presents the project and links to each guide:

| Guide | Repository |
|-------|------------|
| The Stephen King multiverse | `stephen-king` |
| Tolkien's Middle-earth | `middle-earth` |
| The Wizarding World of Harry Potter | `harry-potter` |
| The MCU Without the Marathon | `mcu` |

Each guide is its own site at `https://grand-archives.github.io/<repo>/`, with its English version at `.../<repo>/en/`.

## Features

- Responsive landing page (from 360 px to wide desktop) with light and dark themes that follow the system setting.
- One card per guide, each with an accent color taken from that guide's palette; the whole card is a link.
- Two languages (pt-BR and English) with a discreet language selector; no automatic redirect and no language memory.
- Accessible: visible keyboard focus, `aria-label` on every card, accessible contrast, reduced-motion support.
- Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies.

## Project structure

```
.github/workflows/pages.yml   GitHub Pages deployment (publishes site/)
site/
  index.html                  pt-BR page (root)
  en/index.html               English page
  sitemap.xml  robots.txt     SEO files (robots.txt also lists each guide's sitemap)
  assets/icons/               favicons and apple-touch-icon
  css/style.css               styles
  js/app.js                   shared i18n core + page logic (no visible text)
  i18n/languages.json         languages offered by the selector
  i18n/<lang>/ui.json         UI strings
  i18n/<lang>/data.js         the guide cards
```

## Run locally

There is no build step. Serve `site/` with any static server (opening the files with `file://` does not work, because the page loads JSON and ES modules):

```bash
cd site
python -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000/ (pt-BR) and http://localhost:8000/en/ (English).

## Adding a language

1. Create `site/i18n/<code>/ui.json` and `site/i18n/<code>/data.js` with the same keys, ids and structure as `pt-BR`.
2. Add `{ "code": "<code>", "name": "<Language name>", "path": "<code>/" }` to `site/i18n/languages.json`.
3. Create `site/<code>/index.html` from an existing page (language code, title, description, Open Graph tags, canonical and `../` paths).
4. Add the `hreflang` alternate to every existing page and the new URL (with alternates) to `site/sitemap.xml`.

`js/app.js` needs no change. See `CLAUDE.md` for the details and the head template.

## Adding a guide

Add one entry to `cards` in every `site/i18n/<code>/data.js` (`id`, `title`, `description`, absolute `url` in that language and optional accent colors), and add the guide's `sitemap.xml` to `site/robots.txt`.

## Deployment

The site is published by GitHub Pages through the workflow in `.github/workflows/pages.yml` on every push to `main`. In the repository settings, Pages > Build and deployment > Source must be set to **GitHub Actions**. The repository must be named `grand-archives.github.io` (the organization login is `Grand-Archives`) for the site to be served at the domain root.

## Disclaimer

These are unofficial, free and non-profit fan projects. They have no connection with the authors, studios, publishers or other rights holders of the works, and are not endorsed by them. All the works, names, characters and places mentioned belong to their respective authors and rights holders. No excerpts from the works are reproduced.

## License

Released under the [MIT License](LICENSE). Copyright © 2026 GrandArchives.

The license covers the code and the original texts, map, organization and design of this project. The works, names, characters, places and trademarks it mentions belong to their respective authors and rights holders and are not covered by it; see the [disclaimer](#disclaimer).
