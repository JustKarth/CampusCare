document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
  // Soft-auth: dashboard can be viewed as guest (limited info)
  // const token = requireAuth("index.html");
=======
  // Hard-auth: require a valid token to view the dashboard.
  // If no token is present, redirect to the login page.
  const token = getToken && typeof getToken === "function" ? getToken() : null;
  if (!token) {
    window.location.href = "login.html";
    return;
  }
>>>>>>> ff2694566445899c4cc2ebfdcb384bb5034979c7

  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .replace(".html", "");

  // Top nav tab behavior
  document.querySelectorAll(".tab-btn").forEach(button => {
    const tab = button.dataset.tab;

    if (tab === "overview" && currentPage === "dashboard") {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      switch (tab) {
        case "overview":
          window.location.href = "dashboard.html";
          break;
        case "profile":
          window.location.href = "profile.html";
          break;
        case "resources":
          window.location.href = "resources.html";
          break;
        case "complaints":
          window.location.href = "local-guide.html";
          break;
      }
    });
  });

  // Populate dashboard user info from stored user object
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (user) {
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
    const collegeName = user.collegeName || "";
    const courseName = user.courseName || "";

    const colNameEl = document.querySelector(".college-name");
    if (colNameEl) colNameEl.textContent = collegeName || "< College Name >";

    const userNameEl = document.getElementById("userName");
    if (userNameEl) userNameEl.textContent = fullName || "👤 User";

    const dashNameEl = document.getElementById("dashName");
    if (dashNameEl) dashNameEl.textContent = fullName;
    const dashCollegeEl = document.getElementById("dashCollege");
    if (dashCollegeEl) dashCollegeEl.textContent = collegeName;
    const dashCourseEl = document.getElementById("dashCourse");
    if (dashCourseEl) dashCourseEl.textContent = courseName;
    const dashGradYearEl = document.getElementById("dashGradYear");
    if (dashGradYearEl) dashGradYearEl.textContent = user.graduationYear || "";
  } else {
    // Guest view defaults
    const colNameEl = document.querySelector(".college-name");
    if (colNameEl) colNameEl.textContent = "< College Name >";
    const userNameEl = document.getElementById("userName");
    if (userNameEl) userNameEl.textContent = "Guest";
  }

  // Logout button
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    logout("index.html");
  });
  document.getElementById("logoutSidebar")?.addEventListener("click", () => {
    logout("index.html");
  });
});
