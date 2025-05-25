import { Amplify } from 'aws-amplify';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  Amplify.configure({
    API: {
      GraphQL: {
        endpoint: config.public.amplifyApiEndpoint,
        region: config.public.amplifyRegion,
        defaultAuthMode: 'apiKey', 
        apiKey: config.public.amplifyApiKey,
      }
    }
  });
})
