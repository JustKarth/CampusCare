// User roles and permissions
const USER_ROLES = {
  STUDENT: 'student',
  GUEST: 'guest',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
};

// JWT token expiration
const JWT_EXPIRATION = '7d'; // 7 days

// Pagination defaults
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

// Local guide categories (matching local_guide_categories table)
const LOCAL_GUIDE_CATEGORIES = {
  HEALTHCARE: 'healthcare',
  TECH: 'tech',
  CLOTHING: 'clothing',
  FOOD: 'food',
  LOGISTICS: 'logistics'
};

module.exports = {
  USER_ROLES,
  JWT_EXPIRATION,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  LOCAL_GUIDE_CATEGORIES
};
