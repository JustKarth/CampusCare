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
    // Soft-auth mode: allow browsing without being logged in.
    // Pages can check for null and show limited/guest experience.
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

  let res;
  try {
    res = await fetch(`${getApiBaseUrl()}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });
  } catch (fetchError) {
    // Network error - server not reachable
    const error = new Error("Failed to fetch");
    error.status = 0;
    error.data = { message: "Could not connect to server. Please ensure the backend is running." };
    throw error;
  }

  let data;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch (parseError) {
    // Response is not JSON
    data = {
      message: res.statusText || "Server returned an invalid response",
      status: res.status
    };
  }

  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}
