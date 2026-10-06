export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  features: { inlineStyles: true },

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
    '/**': {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Frame-Options': 'SAMEORIGIN',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
    '/': { headers: { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' } },
    '/stories/**': { headers: { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' } },
    '/privacy': { prerender: true },
  },

  modules: ['@nuxt/fonts'],

  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', weights: [500, 650] },
      { name: 'Source Serif 4', provider: 'google', weights: [400, 600], styles: ['normal', 'italic'] },
      { name: 'Inter', provider: 'google', weights: [400, 500, 600] },
    ],
  },
})