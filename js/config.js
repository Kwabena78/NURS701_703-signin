// ============================================================
// Configuration — Update these after deploying Apps Script
// ============================================================

const CONFIG = {
  // Google Apps Script Web App deployment URL
  API_URL: 'https://script.google.com/macros/s/AKfycbzYCI3LAcyIM6inP4liHqNookKvg11OGEc-oJRIkOai6qPpJmCbFWNIGIesvo3LXoHL/exec',

  // GitHub Pages frontend URL
  APP_URL: 'https://kwabena78.github.io/NURS701_703-signin',

  // Admin dashboard auto-refresh interval (milliseconds)
  REFRESH_INTERVAL: 30000,

  // Session types available per course
  SESSION_TYPES: {
    'NURS701': ['SIM Lab', 'Skills Lab 1 (General)', 'Skills Lab 2 (OSCE)'],
    'NURS703': ['SIM Lab']
  },

  // Courses
  COURSES: ['NURS701', 'NURS703']
};
