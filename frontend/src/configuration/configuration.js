console.log('Environment variables:', {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  VITE_GOOGLE_REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI
});

export const OAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  authUri: "https://accounts.google.com/o/oauth2/auth",
};

// Fallback to default if environment variable is not set
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://blog-test-trong.duckdns.org/api';
