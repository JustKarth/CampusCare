@echo off
echo Starting CampusCare Development Servers...
echo.

REM Set Node.js path
set NODE_PATH=C:\Program Files\nodejs
set PATH=%NODE_PATH%;%PATH%

REM Verify Node.js is available
echo Checking Node.js installation...
"%NODE_PATH%\node.exe" --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found at %NODE_PATH%
    pause
    exit /b 1
)

"%NODE_PATH%\npm.cmd" --version
if %errorlevel% neq 0 (
    echo ERROR: npm not found at %NODE_PATH%
    pause
    exit /b 1
)

echo Node.js and npm are working!
echo.

REM Start Backend
echo Starting Backend Server...
cd /d "d:\College\Project\CampusCare\backend"
start "CampusCare Backend" cmd /k "echo Backend starting on port 5000... && \"%NODE_PATH%\node.exe\" server.js"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start Frontend
echo Starting Frontend Server...
cd /d "d:\College\Project\CampusCare\frontend\react"
start "CampusCare Frontend" cmd /k "echo Frontend starting on port 3000... && \"%NODE_PATH%\npm.cmd\" run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Please wait 10-15 seconds for servers to fully start.
echo.
pause
