export const OAuthConfig = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  authUri: "https://accounts.google.com/o/oauth2/auth",
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
