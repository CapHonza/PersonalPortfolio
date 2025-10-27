// assets/js/lang.js
(() => {
  const CANDIDATE_PATHS = [
    'assets/i18n/lang.json',   // kořen
    '../assets/i18n/lang.json' // podsložky (PPortfolio/, CPCompany/)
  ];
  const DEFAULT_LANG = 'en';
  let dict = null;
  let current = null;

  const pickDictPath = async () => {
    if (window.LANG_DICT_PATH) return window.LANG_DICT_PATH; // ruční override ze stránky
    for (const p of CANDIDATE_PATHS) {
      try {
        const res = await fetch(p, { cache: 'no-store' });
        if (res.ok) return p;
      } catch (_) {}
    }
    throw new Error('lang.json not found in expected locations');
  };

  const loadDict = async () => {
    if (dict) return dict;
    const path = await pickDictPath();
    const res = await fetch(path, { cache: 'no-store' });
    dict = await res.json();
    return dict;
  };

  const getInitialLang = () => {
    const saved = localStorage.getItem('lang');
    if (saved) return saved;
    const nav = (navigator.language || 'en').toLowerCase();
    return nav.startsWith('cs') ? 'cz' : DEFAULT_LANG;
  };

  const setActiveButtons = (lang) => {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  };

  const applyLang = (lang) => {
    if (!dict || !dict[lang]) return;

    // Title + meta (pokud máš klíče)
    if (dict[lang]['meta-title']) document.title = dict[lang]['meta-title'];
    const meta = document.querySelector('meta[name="description"]');
    if (meta && dict[lang]['meta-description']) {
      meta.setAttribute('content', dict[lang]['meta-description']);
    }

    // Text / HTML
    document.querySelectorAll('[data-lang-key]').forEach(el => {
      const key = el.dataset.langKey;
      const val = dict[lang][key];
      if (val == null) return;

      const attr = el.getAttribute('data-lang-attr');
      if (attr) { el.setAttribute(attr, val); return; }

      if (el.hasAttribute('data-lang-html')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    setActiveButtons(lang);
    localStorage.setItem('lang', lang);
    current = lang;
  };

  const init = async () => {
    await loadDict();
    applyLang(getInitialLang());

    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      const lang = btn.dataset.lang;
      if (lang && lang !== current) applyLang(lang);
    });
  };

  document.addEventListener('DOMContentLoaded', init);
})();
