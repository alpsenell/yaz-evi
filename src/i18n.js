import i18next from 'i18next'
import I18NextVue from 'i18next-vue'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './languages/en.ts'
import tr from './languages/tr.ts'

i18next
  .use(LanguageDetector)
  .init({
    debug: true,
    fallbackLng: 'en',
    global: true,
    resources: {
      en: {
        translation: en
      },
      tr: {
        translation: tr
      }
    }
  });

export default function (app) {
  app.use(I18NextVue, { i18next })
  return app
}
