// Application constants

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  BLOGS: '/blogs',
  RESOURCES: '/resources',
  LOCAL_GUIDE: '/local-guide',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  BLOGS: {
    LIST: '/blogs',
    BY_ID: (id) => `/blogs/${id}`,
    LIKE: (id) => `/blogs/${id}/like`,
    COMMENTS: (id) => `/blogs/${id}/comments`,
  },
  RESOURCES: {
    LIST: '/resources',
  },
  LOCAL_GUIDE: {
    CATEGORIES: '/local-guide/categories',
    PLACES: '/local-guide/places',
    PLACES_BY_CATEGORY: (category) => `/local-guide/places/${category}`,
    RATING: (id) => `/local-guide/places/${id}/rating`,
  },
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  COLLEGE_NAME: 'collegeName',
};

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  BLOG_TITLE_MAX_LENGTH: 128,
  COMMENT_MAX_LENGTH: 1000,
  GRADUATION_YEAR_MIN: 2000,
  GRADUATION_YEAR_MAX: 2100,
};

export const RATING_OPTIONS = [1, 2, 3, 4, 5];
