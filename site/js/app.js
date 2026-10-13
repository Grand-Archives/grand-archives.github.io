/* ===== i18n core: identical in every GrandArchives site. Contains NO visible text. =====
 * Paste at the very top of site/js/app.js (inside the same classic <script defer> file).
 *
 * Contract
 *  - Each page declares its language in <html lang="...">; that value is the folder name under site/i18n/.
 *  - UI strings:  site/i18n/<lang>/ui.json   (flat object: "section.key": "text", may contain trusted inline HTML)
 *  - Content:     site/i18n/<lang>/data.js   (ES module, `export default {...}`)
 *  - Languages:   site/i18n/languages.json   ([{ "code": "pt-BR", "name": "Português", "path": "" }, { "code": "en", "name": "English", "path": "en/" }])
 *                 `path` is relative to the site root; "" is the Portuguese root page.
 *  - Markup:      data-i18n="key"              -> element.innerHTML = t(key)
 *                 data-i18n-attr="attr:key;attr2:key2"  -> element.setAttribute(attr, t(key))
 *  - Placeholders: "{name}" in a string is replaced from the vars object passed to t().
 *  - Plurals:     tn("key", n) uses "key.one" / "key.other" (Intl.PluralRules for the page language).
 */
const I18N = (() => {
  const ROOT = new URL('../', document.currentScript.src); // site root (this file lives in site/js/)
  const LANG = document.documentElement.lang;
  let ui = {};

  const t = (key, vars) => {
    const s = ui[key];
    if (s == null) { console.error('[i18n] missing key:', key); return key; }
    return vars ? s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? '')) : s;
  };
  const tn = (key, n, vars) => t(`${key}.${new Intl.PluralRules(LANG).select(n)}`, { n, ...vars });

  const apply = (scope = document) => {
    scope.querySelectorAll('[data-i18n]').forEach(el => { el.innerHTML = t(el.dataset.i18n); });
    scope.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':').map(x => x.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
  };

  // Renders a <select> of all languages into `container` (also with a single language);
  // keeps the current hash/search so the equivalent view opens in the other language.
  const languageSwitcher = (languages, container) => {
    if (!container) return;
    const sel = document.createElement('select');
    sel.className = 'langsel';
    sel.setAttribute('aria-label', t('lang.label'));
    languages.forEach(l => {
      const o = document.createElement('option');
      o.value = l.code; o.textContent = l.name; o.selected = l.code === LANG;
      sel.appendChild(o);
    });
    sel.addEventListener('change', () => {
      const target = languages.find(l => l.code === sel.value);
      if (target) location.href = new URL(target.path, ROOT).href + location.search + location.hash;
    });
    container.appendChild(sel);
  };

  // Loads ui.json, data.js and languages.json for the page language. Returns { data, languages }.
  const load = async () => {
    const base = new URL(`i18n/${LANG}/`, ROOT);
    const [uiRes, mod, langRes] = await Promise.all([
      fetch(new URL('ui.json', base)),
      import(new URL('data.js', base).href),
      fetch(new URL('i18n/languages.json', ROOT)),
    ]);
    ui = await uiRes.json();
    return { data: mod.default, languages: await langRes.json() };
  };

  return { ROOT, LANG, t, tn, apply, languageSwitcher, load, asset: p => new URL(`assets/${p}`, ROOT).href };
})();
/* ===== end i18n core ===== */

/* ===== GrandArchives hub: page logic. No user-visible text lives here: UI strings come from
 * i18n/<lang>/ui.json (I18N.t) and the guide cards from i18n/<lang>/data.js. ===== */
(async () => {
const { data, languages } = await I18N.load();
const { t } = I18N;

// Body skeleton. Every element with text carries data-i18n / data-i18n-attr, filled by I18N.apply().
document.getElementById("app").innerHTML = `
<div class="wrap">
  <div class="langbar" id="langbar"></div>
  <header class="hero">
    <img class="mark" id="mark" alt="" width="56" height="56">
    <div class="hero-text">
      <h1 data-i18n="brand.name"></h1>
      <p class="tagline" data-i18n="brand.tagline"></p>
    </div>
  </header>
  <section class="about" aria-labelledby="about-h">
    <h2 class="eyebrow" id="about-h" data-i18n="about.title"></h2>
    <p data-i18n="about.text"></p>
  </section>
  <section class="guides" aria-labelledby="guides-h">
    <h2 class="eyebrow" id="guides-h" data-i18n="guides.title"></h2>
    <ul class="cards" id="cards"></ul>
  </section>
  <footer class="foot">
    <p class="copy" data-i18n="footer.copyright"></p>
    <p class="notice" data-i18n="footer.notice"></p>
  </footer>
</div>`;

document.getElementById("mark").src = I18N.asset("icons/favicon.svg");

// One card per entry of data.cards: { id, title, description, url, accent?, accentDark?, accent2?, accent2Dark? }.
// The whole card is the link; colors are optional presentation hints handed to CSS as custom properties.
const cards = document.getElementById("cards");
data.cards.forEach(c => {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.className = "card";
  a.href = c.url;
  a.dataset.guide = c.id;
  a.setAttribute("aria-label", t("card.aria", { title: c.title }));
  const set = (prop, val) => { if (val) a.style.setProperty(prop, val); };
  set("--c1", c.accent);
  set("--c1d", c.accentDark);
  set("--c2", c.accent2);
  set("--c2d", c.accent2Dark);
  const h = document.createElement("h3");
  h.className = "card-title";
  h.textContent = c.title;
  const p = document.createElement("p");
  p.className = "card-desc";
  p.textContent = c.description;
  a.append(h, p);
  li.appendChild(a);
  cards.appendChild(li);
});

I18N.apply();
I18N.languageSwitcher(languages, document.getElementById("langbar"));
})();
