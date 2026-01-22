# Environment Setup

## Required: Create `.env` file

The frontend requires a `.env` file to configure the API base URL. 

### Steps:

1. **Create `.env` file** in the `CampusCare/frontend/react/` directory

2. **Add the following content:**
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. **If your backend runs on a different host/port**, update the URL accordingly:
   ```
   VITE_API_BASE_URL=http://your-backend-host:port/api
   ```

### Example `.env` file:
```
# API Base URL Configuration
# Change this if your backend is running on a different host/port
VITE_API_BASE_URL=http://localhost:5000/api
```

### Notes:
- The `.env` file is gitignored (not committed to version control)
- After creating/updating `.env`, restart your development server
- The default value in `src/config/api.js` is `http://localhost:5000/api` if `VITE_API_BASE_URL` is not set
