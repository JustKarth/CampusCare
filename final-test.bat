@echo off
echo Final attempt - Running server with explicit logging...
cd /d "d:\College\Project\CampusCare\frontend\react"

echo Starting server with explicit output...
node simple-server.js > server.log 2>&1 &

echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo Checking if server is running...
netstat -ano | findstr :3001

echo.
echo Server log contents:
type server.log

echo.
echo Testing server access...
curl http://localhost:3001/ || echo curl not available

pause
