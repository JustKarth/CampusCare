# Authentication Integration Guide

## Overview
This document describes the frontend-backend authentication integration for CampusCare.

## Integration Status: ✅ Complete

### Changes Made

#### Backend (`backend/app.js`)
- **CORS Configuration**: Updated to allow frontend origins (localhost, file://, etc.)
- Configured to accept credentials and proper headers for JWT authentication

#### Frontend (`frontend/js/auth.js`)
- **Registration Flow**:
  - Added form validation for required fields
  - Added loading states to prevent multiple submissions
  - Improved error handling with network error detection
  - Fixed redirect to `login.html` after successful registration
  
- **Login Flow**:
  - Added form validation
  - Added loading states
  - Improved error handling
  - Proper token and user data storage in localStorage

#### Frontend (`frontend/js/api.js`)
- **Enhanced Error Handling**:
  - Better network error detection
  - Improved JSON parsing with fallback for non-JSON responses
  - More descriptive error messages

#### Frontend (`frontend/frontend/index.html`)
- Changed to redirect to `login.html` instead of duplicating login form

#### Frontend (`frontend/frontend/register.html`)
- Updated link to point directly to `login.html`

## API Endpoints

### Registration
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "student@college.edu",
    "password": "password123",
    "reg_no": "REG123456",
    "first_name": "John",
    "middle_name": "Middle", // optional
    "last_name": "Doe",
    "course_id": 1,
    "graduation_year": 2026,
    "date_of_birth": "2000-01-01",
    "native_state_id": 1, // optional
    "native_city": "City" // optional
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": { ... }
  }
  ```

### Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "student@college.edu",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
      "userId": 1,
      "email": "student@college.edu",
      "firstName": "John",
      "lastName": "Doe",
      "collegeId": 1,
      "collegeName": "College Name",
      "courseName": "Course Name",
      "isModerator": false,
      "isAdmin": false,
      "avatarUrl": null
    }
  }
  ```

### Get Profile
- **Endpoint**: `GET /api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "user": { ... }
  }
  ```

## Token Management

- **Storage**: JWT tokens are stored in `localStorage` with key `"token"`
- **User Data**: User object stored in `localStorage` with key `"user"`
- **Token Format**: `Bearer <token>` in Authorization header
- **Expiration**: 7 days (configured in `backend/config/constants.js`)

## Testing the Integration

### Prerequisites
1. Backend server running on `http://localhost:5000`
2. Database configured and initialized
3. Frontend files served (via HTTP server or file:// protocol)

### Test Steps

1. **Start Backend**:
   ```bash
   cd backend
   npm install
   npm start
   # Server should start on port 5000
   ```

2. **Open Frontend**:
   - Open `frontend/frontend/login.html` in a browser
   - Or serve via HTTP: `python -m http.server 8000` (or similar)

3. **Test Registration**:
   - Click "Register here" link
   - Fill in all required fields
   - Submit form
   - Should redirect to login page on success

4. **Test Login**:
   - Enter email and password
   - Submit form
   - Should redirect to dashboard on success
   - Check browser console/localStorage to verify token storage

5. **Test Dashboard**:
   - Dashboard should display user information from localStorage
   - Logout button should clear token and redirect to login

## Error Handling

### Frontend Error Messages
- **Network Errors**: "Network error: Could not connect to server..."
- **Validation Errors**: Shows field-specific validation messages
- **401 Unauthorized**: "Unauthorized: Invalid credentials or token."
- **400 Bad Request**: Shows validation error details
- **500 Server Error**: "Server error. Please try again later."

### Backend Error Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ // for validation errors
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Security Notes

1. **CORS**: Currently allows all origins for development. Update in production.
2. **JWT Secret**: Ensure `JWT_SECRET` is set in backend `.env` file
3. **Password**: Passwords are hashed using bcrypt before storage
4. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)

## Next Steps

- [ ] Add token refresh mechanism
- [ ] Add password reset functionality
- [ ] Add email verification
- [ ] Implement proper session management
- [ ] Add rate limiting for auth endpoints
- [ ] Add CSRF protection for production
