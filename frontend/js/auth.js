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

  // Validate required fields
  if (!payload.email || !payload.password || !payload.reg_no || !payload.first_name || 
      !payload.last_name || !payload.course_id || !payload.graduation_year || !payload.date_of_birth) {
    alert("Please fill in all required fields.");
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn?.textContent;
  
  try {
    // Disable button and show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Registering...";
    }

    const res = await apiRequest("/auth/register", "POST", payload);
    
    // Store token and user if returned (though registration might not return token)
    if (res.token) {
      setToken(res.token);
    }
    if (res.user) {
      localStorage.setItem("user", JSON.stringify(res.user));
    }
    
    alert("Registration successful! Redirecting to login...");
    window.location.href = "login.html";
  } catch (err) {
    // Handle network errors
    if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
      alert("Network error: Could not connect to server. Please check if the backend is running.");
    } else {
      alert(formatApiError(err));
    }
  } finally {
    // Re-enable button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText || "Register";
    }
  }
});

/* ================= LOGIN ================= */
document.getElementById("loginForm")?.addEventListener("submit", async e => {
  e.preventDefault();

  const emailEl = document.getElementById("email");
  const passwordEl = document.getElementById("password");

  const email = emailEl?.value?.trim();
  const password = passwordEl?.value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn?.textContent;

  try {
    // Disable button and show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Logging in...";
    }

    const res = await apiRequest("/auth/login", "POST", {
      email,
      password
    });

    // Store token and user data
    if (!res.token) {
      throw new Error("No token received from server.");
    }

    setToken(res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    if (res.user?.collegeName) {
      localStorage.setItem("collegeName", res.user.collegeName);
    }

    // Redirect to dashboard
    window.location.href = "dashboard.html";
  } catch (err) {
    // Handle network errors
    if (err.message === "Failed to fetch" || err.message.includes("NetworkError")) {
      alert("Network error: Could not connect to server. Please check if the backend is running on http://localhost:5000");
    } else {
      alert(formatApiError(err));
    }
  } finally {
    // Re-enable button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText || "Login";
    }
  }
});
