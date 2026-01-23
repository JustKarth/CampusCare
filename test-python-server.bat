@echo off
echo Testing basic connectivity...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Checking if Python is available...
python --version 2>&1
if %errorlevel% neq 0 (
    echo Python not found, trying py launcher...
    py --version 2>&1
)

echo.
echo Starting Python server with explicit output...
python -m http.server 3003 > python_server.log 2>&1 &
echo Server PID: %errorlevel%

echo Waiting for server to start...
timeout /t 5 /nobreak >nul

echo Checking if port 3003 is listening...
netstat -ano | findstr :3003

echo.
echo Server log contents:
type python_server.log 2>&1

echo.
echo Testing server with curl...
curl http://localhost:3003/index-working.html 2>&1

pause
