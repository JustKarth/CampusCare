function formatApiError(err) {
  const status = err?.status;
  const data = err?.data;

  if (status === 400 && data?.errors?.length) {
    const details = data.errors
      .map(e => `- ${e.field}: ${e.message}`)
      .join("\n");
    return `${data.message || "Validation failed"}\n\n${details}`;
  }

  if (status === 401) return "Unauthorized: Invalid credentials or token.";
  if (status === 403) return err.message || "Forbidden: Access denied.";
  if (status === 409) return err.message || "Conflict: This record already exists.";
  if (status >= 500) return err.message || "Server error. Please try again later.";

  return err?.message || "Something went wrong.";
}

/* ================= REGISTER ================= */
document.getElementById("registerForm")?.addEventListener("submit", async e => {
  e.preventDefault();

  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");
  const confirmPasswordEl = document.getElementById("confirm_password");
  const regNoEl = document.getElementById("reg_no");
  const firstNameEl = document.getElementById("first_name");
  const middleNameEl = document.getElementById("middle_name");
  const lastNameEl = document.getElementById("last_name");
  const courseIdEl = document.getElementById("course_id");
  const graduationYearEl = document.getElementById("graduation_year");
  const dobEl = document.getElementById("date_of_birth");
  const nativeStateIdEl = document.getElementById("native_state_id");
  const nativeCityEl = document.getElementById("native_city");

  const password = passwordEl?.value || "";
  const confirmPassword = confirmPasswordEl?.value || "";
  if (confirmPasswordEl && password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  const payload = {
    email: emailEl?.value?.trim(),
    password,
    reg_no: regNoEl?.value?.trim(),
    first_name: firstNameEl?.value?.trim(),
    middle_name: middleNameEl?.value?.trim() || undefined,
    last_name: lastNameEl?.value?.trim(),
    course_id: courseIdEl?.value ? parseInt(courseIdEl.value, 10) : undefined,
    graduation_year: graduationYearEl?.value ? parseInt(graduationYearEl.value, 10) : undefined,
    date_of_birth: dobEl?.value,
    native_state_id: nativeStateIdEl?.value ? parseInt(nativeStateIdEl.value, 10) : undefined,
    native_city: nativeCityEl?.value?.trim() || undefined
  };

  try {
    await apiRequest("/auth/register", "POST", payload);
    alert("Registration successful! Please login.");
    window.location.href = "index.html";
  } catch (err) {
    alert(formatApiError(err));
  }
});

/* ================= LOGIN ================= */
document.getElementById("loginForm")?.addEventListener("submit", async e => {
  e.preventDefault();

  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");

  try {
    const res = await apiRequest("/auth/login", "POST", {
      email: emailEl?.value?.trim(),
      password: passwordEl?.value
    });

    setToken(res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    if (res.user?.collegeName) localStorage.setItem("collegeName", res.user.collegeName);

    window.location.href = "dashboard.html";
  } catch (err) {
    alert(formatApiError(err));
  }
});
