// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['vuetify'],
  },
  css: [
    'vuetify/lib/styles/main.sass',
  ],
  nitro: {
    plugins: ['~/server/db.ts'],
  },
  typescript: {
    strict: true,
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})
