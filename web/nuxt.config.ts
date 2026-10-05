export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      // the title template is set in app.vue: config must be serialisable, so no functions here
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#FBF7F1' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'preconnect', href: 'https://cdn.sanity.io' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,650&family=Inter:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      sanity: {
        projectId: '',
        dataset: 'production',
        apiVersion: '2025-02-19',
      },
      siteUrl: 'http://localhost:3000',
    },
  },

  routeRules: {
    '/': { swr: 60 },
    '/stories/**': { swr: 60 },
    // '/privacy': { prerender: true },
  },
})