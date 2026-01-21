(function () {
  // Global config (plain HTML/CSS/JS, no bundler)
  // Change this if your backend port/host changes.
  const API_BASE_URL = "http://localhost:5000/api";

  // Prefer a namespaced config object to avoid "const redeclare" issues across scripts.
  window.CAMPUSCARE_CONFIG = window.CAMPUSCARE_CONFIG || {};
  window.CAMPUSCARE_CONFIG.API_BASE_URL = API_BASE_URL;

  // Backwards-compatible global for any older scripts.
  window.API_BASE_URL = API_BASE_URL;
})();
