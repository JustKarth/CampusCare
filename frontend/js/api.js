function getApiBaseUrl() {
  return (
    window.CAMPUSCARE_CONFIG?.API_BASE_URL ||
    window.API_BASE_URL ||
    "http://localhost:5000/api"
  );
}

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

function logout(redirectTo = "index.html") {
  setToken(null);
  localStorage.removeItem("user");
  localStorage.removeItem("collegeName");
  window.location.href = redirectTo;
}

function requireAuth(redirectTo = "index.html") {
  const token = getToken();
  if (!token) {
<<<<<<< HEAD
    logout(redirectTo);
=======
    // Soft-auth mode: allow browsing without being logged in.
    // Pages can check for null and show limited/guest experience.
>>>>>>> main
    return null;
  }
  return token;
}

async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  const headers = { "Content-Type": "application/json" };

  // token can be:
  // - string JWT
  // - true (meaning "use token from localStorage")
  // - null/undefined/false (no auth header)
  const resolvedToken = token === true ? getToken() : token;
  if (resolvedToken) {
    headers["Authorization"] = `Bearer ${resolvedToken}`;
  }

  const res = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}
