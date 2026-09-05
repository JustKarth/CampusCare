// API Base URL configuration
// Replaces: window.CAMPUSCARE_CONFIG.API_BASE_URL from config.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');
