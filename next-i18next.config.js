/** @type {import('next-i18next').UserConfig} */
const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "ar"],
  },
  react: { useSuspense: false },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
