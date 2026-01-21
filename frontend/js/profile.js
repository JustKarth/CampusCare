(async function () {
  // Require login to view profile
  const token = requireAuth("index.html");
  if (!token) return;

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value ?? "";
  };

  try {
    const res = await apiRequest("/auth/profile", "GET", null, true);
    const u = res.user || {};

    const fullName = [u.firstName, u.middleName, u.lastName].filter(Boolean).join(" ");

    setText("name", fullName);
    setText("email", u.email);
    setText("college", u.collegeName || u.collegeId);
    setText("course", u.courseName || u.courseId);
    setText("gradYear", u.graduationYear);
  } catch (err) {
    // If token expired/invalid, kick back to login
    if (err?.status === 401) {
      logout("index.html");
      return;
    }
    alert(err?.message || "Failed to load profile.");
  }
})();

