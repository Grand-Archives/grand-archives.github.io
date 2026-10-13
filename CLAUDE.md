# CLAUDE.md

**Always respond to the user in Brazilian Portuguese (pt-BR)**, regardless of the language of the conversation, an issue/PR or any file being discussed.
Everything written into the repository (code, comments, commits, docs) stays in English, except the site's own translated content.

## What this repo is

The GrandArchives organization hub: a static landing page published on GitHub Pages at the organization root, `https://grand-archives.github.io/` (pt-BR) and `https://grand-archives.github.io/en/` (English). It presents the organization and links to each guide site (siblings in the same org): `stephen-king`, `middle-earth`, `harry-potter` and `mcu`, each published at `https://grand-archives.github.io/<repo>/`.
Plain HTML/CSS/JS only. **No build step, no framework, no dependencies** (a Google Fonts stylesheet is the only external request). The `GrandArchives` org shares this layout across its sites.

The repo is named `grand-archives.github.io`. The GitHub org login is `Grand-Archives` and the Pages domain follows the login, so the repo name must keep the hyphen: it is the special `<login>.github.io` repository that Pages serves at the domain root.

## Folder structure

```
CLAUDE.md
README.md
.github/workflows/pages.yml        # publishes the whole site/ folder (upload-pages-artifact path: site)
site/                              # everything that gets published
  index.html                       # pt-BR page, site root
  en/index.html                    # English page, published at /en/
  sitemap.xml                      # every language URL, with xhtml:link hreflang alternates
  robots.txt                       # allow all + the sitemap of the hub and of each guide
  assets/icons/                    # favicon.ico, favicon.svg, apple-touch-icon.png (org logo)
  css/style.css                    # all styles (language-independent)
  js/app.js                        # i18n core (verbatim) + page logic; contains NO user-visible text
  i18n/languages.json              # [{ "code", "name", "path" }] used by the language selector
  i18n/pt-BR/ui.json               # UI strings (flat "section.key": "text"; may hold trusted inline HTML)
  i18n/pt-BR/data.js               # content: the guide cards (ES module, `export default { cards: [...] }`)
  i18n/en/{ui.json,data.js}        # English UI strings and cards (same keys, ids and structure as pt-BR)
  <code>/index.html                # one page per extra language, e.g. site/en/index.html
  i18n/<code>/{ui.json,data.js}    # data of each extra language
```

The cards have no images; the only picture is the org mark (`assets/icons/favicon.svg`) in the header.

## How a page works

`<html lang="...">` is the language code and also the folder name under `site/i18n/`. The page itself is light: `<head>` + `<div id="app"></div>` + a `<noscript>` message.
`js/app.js` (classic `<script defer>`) starts with the shared i18n core (`I18N.t / tn / apply / languageSwitcher / load / asset / ROOT / LANG`). It then:
loads `ui.json`, `data.js` and `languages.json`, injects the body skeleton (markup with `data-i18n` / `data-i18n-attr`), renders one card per entry of `data.cards`, calls `I18N.apply()` and renders the language selector.

- The i18n core block at the top of `app.js` is **identical in every GrandArchives site**. Do not edit it here; fix it in the shared source and paste it verbatim everywhere.
- `data-i18n="key"` sets `innerHTML`; `data-i18n-attr="attr:key;attr2:key2"` sets attributes. `{name}` placeholders are filled by `t(key, vars)`. Plurals use `key.one` / `key.other` through `tn(key, n)`.
- Locale-sensitive code must use `I18N.LANG`. Never concatenate translated fragments in a way that fixes one language's word order: use `{placeholders}` templates.
- `ui.json` must contain `lang.label` (aria-label of the language selector) and `card.aria` (aria-label of each card, with a `{title}` placeholder).
- Each card is `{ id, title, description, url, accent?, accentDark?, accent2?, accent2Dark? }`. `url` is the absolute URL of the guide in that language (pt-BR: `.../<repo>/`, en: `.../<repo>/en/`) because the guides are separate sites. `id` is the guide's repo name and is identical in every language. The accent colors come from each guide's own palette (optional; they are handed to CSS as custom properties).
- The selector (`<select class="langsel">` inside `#langbar`) is always rendered at the top, listing every entry of `languages.json` (Português and English today). There is no automatic redirect by browser language and no language memory in `localStorage`; do not add them.
- Languages present: `pt-BR` (root) and `en` (`/en/`).

## How to add a guide card

When a new guide site joins the org, add one entry to `cards` in **every** `site/i18n/<code>/data.js` (translated `title`/`description`, `url` pointing to that language's page of the new guide, accent colors from the guide's palette). Also add the guide's `sitemap.xml` to `site/robots.txt`. `app.js` and the HTML pages need no edit.

## How to add a language (steps shown for `en`, which already exists and is the worked example)

`app.js` must not need any edit.

1. Create `site/i18n/en/ui.json` (same keys as `pt-BR/ui.json`, translated, including `lang.label`, `card.aria`, the about text and the unofficial-fan-project/rights notice) and `site/i18n/en/data.js` (same cards, ids and colors as `pt-BR/data.js`, translated titles/descriptions and each guide's URL in that language).
2. Add `{ "code": "en", "name": "English", "path": "en/" }` to `site/i18n/languages.json`.
3. Create `site/en/index.html` from the head template below, with the right `lang`, `<title>`, description, Open Graph tags, canonical and relative `../` paths.
4. Add the `hreflang` alternate for the new language to the `<head>` of **every existing language page** (and keep `x-default` pointing to the Portuguese root).
5. Add the new URL to `site/sitemap.xml` as a `<url>` with `xhtml:link` alternates for every language incl. `x-default`, and add the new alternate to the existing `<url>` entries.
6. Make sure each guide already has that language; otherwise point the card to the guide's default page.
7. Test through a static server (never `file://`): no console errors, favicons 200, the selector appears on both pages and switches to the equivalent URL keeping hash and query.

Head template (pt-BR root page shown; for `site/en/index.html` use `lang="en"`, `og:locale` `en_US`, `canonical`/`og:url` `https://grand-archives.github.io/en/`, English texts, and prefix every local path with `../`):

```html
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>GrandArchives: guias dos grandes universos da ficção</title>
<meta name="description" content="...">
<link rel="canonical" href="https://grand-archives.github.io/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="GrandArchives">
<meta property="og:locale" content="pt_BR">
<meta property="og:locale:alternate" content="en_US">   <!-- one per other language -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:url" content="https://grand-archives.github.io/">
<link rel="alternate" hreflang="pt-BR" href="https://grand-archives.github.io/">
<link rel="alternate" hreflang="en" href="https://grand-archives.github.io/en/">
<link rel="alternate" hreflang="x-default" href="https://grand-archives.github.io/">
<link rel="icon" href="assets/icons/favicon.ico" sizes="any">
<link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gloock&family=Instrument+Sans:wght@400;500;600&display=swap">
<link rel="stylesheet" href="css/style.css">
<script src="js/app.js" defer></script>
</head>
<body>
<div id="app"></div>
<noscript>Message in the page language saying JavaScript is required.</noscript>
</body>
</html>
```

## Rules

- pt-BR is the primary language and stays at the root URL; other languages live under `site/<code>/`.
- The credits statement ("every source consulted is credited on each site") and the unofficial-fan-project/rights notice are mandatory in every language. Footer copyright reads `© 2026 GrandArchives.`
- Design follows the org logo: petrol `#12414A` and cream `#F1EBDD` (see the logo files in the org assets). Keep contrast accessible and the layout free of horizontal scroll from 360 px up.
- No build step, no framework, no new dependencies.
- Always test through a static server (e.g. `npx serve site` or `python -m http.server` inside `site/`), never `file://`: the page loads `ui.json` and `data.js` with `fetch` / `import()`.
- Commits are in English, Conventional Commits style (`feat:`, `fix:`, `refactor:` ...), on branch `main`.
- Never add AI-attribution trailers (`Co-Authored-By`, `Claude-Session`, "Generated with ...") to commits or PR descriptions.
