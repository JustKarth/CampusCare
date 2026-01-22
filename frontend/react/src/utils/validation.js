// Form validation utilities

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  // At least 6 characters
  return password && password.length >= 6;
}

export function validateRequired(value) {
  return value && value.trim().length > 0;
}

export function validateNumber(value, min = null, max = null) {
  const num = Number(value);
  if (isNaN(num)) return false;
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  return true;
}

export function validateDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

export function validateRegistrationForm(formData) {
  const errors = {};

  if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (formData.password !== formData.confirm_password) {
    errors.confirm_password = 'Passwords do not match';
  }

  if (!validateRequired(formData.reg_no)) {
    errors.reg_no = 'Registration number is required';
  }

  if (!validateRequired(formData.first_name)) {
    errors.first_name = 'First name is required';
  }

  if (!validateRequired(formData.last_name)) {
    errors.last_name = 'Last name is required';
  }

  if (!validateNumber(formData.course_id, 1)) {
    errors.course_id = 'Valid course ID is required';
  }

  if (!validateNumber(formData.graduation_year, 2000, 2100)) {
    errors.graduation_year = 'Valid graduation year is required (2000-2100)';
  }

  if (!validateDate(formData.date_of_birth)) {
    errors.date_of_birth = 'Valid date of birth is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateBlogForm(title, content) {
  const errors = {};

  if (!validateRequired(title)) {
    errors.title = 'Blog title is required';
  } else if (title.length > 128) {
    errors.title = 'Blog title must be 128 characters or less';
  }

  if (!validateRequired(content)) {
    errors.content = 'Blog content is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCommentForm(content) {
  const errors = {};

  if (!validateRequired(content)) {
    errors.content = 'Comment content is required';
  } else if (content.length > 1000) {
    errors.content = 'Comment must be 1000 characters or less';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
