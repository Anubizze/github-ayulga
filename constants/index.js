const ALLOWED_LANGS = ['kz', 'ru'];
const DEFAULT_LANG = 'kz';

const safeLang = (lang) =>
  lang && ALLOWED_LANGS.includes(lang) ? lang : DEFAULT_LANG;

module.exports = {
  ALLOWED_LANGS,
  DEFAULT_LANG,
  safeLang,
};
