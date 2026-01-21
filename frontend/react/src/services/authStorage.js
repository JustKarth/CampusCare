// Token and user storage helpers
// Replaces: getToken(), setToken() from api.js

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

export function getUser() {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function setUser(user) {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.collegeName) {
      localStorage.setItem('collegeName', user.collegeName);
    }
  } else {
    localStorage.removeItem('user');
    localStorage.removeItem('collegeName');
  }
}

export function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('collegeName');
}
