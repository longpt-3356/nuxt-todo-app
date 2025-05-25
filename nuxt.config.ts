// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/ui'],
  runtimeConfig: {
    public: {
      amplifyApiEndpoint: process.env.AMPLIFY_API_ENDPOINT,
      amplifyRegion: process.env.AMPLIFY_REGION,
      amplifyApiKey: process.env.AMPLIFY_API_KEY,
    },
  },
})