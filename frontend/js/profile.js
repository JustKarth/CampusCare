(async function () {
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
    if (err?.status === 401) {
      setText("name", "Guest");
      setText("email", "Login required");
      setText("college", "-");
      setText("course", "-");
      setText("gradYear", "-");
      return;
    }
    alert(err?.message || "Failed to load profile.");
  }
})();

