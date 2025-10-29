const envVars = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI
};

console.log('Configuration loading...');
console.log('Environment variables:', envVars);

const DEFAULT_API_URL = 'https://blog-test-trong.duckdns.org/api';

export const OAuthConfig = {
  clientId: envVars.VITE_GOOGLE_CLIENT_ID,
  redirectUri: envVars.VITE_GOOGLE_REDIRECT_URI,
  authUri: "https://accounts.google.com/o/oauth2/auth",
};

// Set API_BASE_URL with debug logging
const apiBaseUrl = envVars.VITE_API_BASE_URL || DEFAULT_API_URL;
console.log('Selected API_BASE_URL:', apiBaseUrl);
console.log('Using default URL:', !envVars.VITE_API_BASE_URL);

export const API_BASE_URL = apiBaseUrl;
