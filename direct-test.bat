@echo off
echo Creating a simple static file server...
cd /d "d:\College\Project\CampusCare\frontend\react

echo Creating a simple HTML file...
echo ^<!DOCTYPE html^> > test.html
echo ^<html^> >> test.html
echo ^<head^> >> test.html
echo ^<title^>Test Page^</title^> >> test.html
echo ^</head^> >> test.html
echo ^<body^> >> test.html
echo ^<h1^>CampusCare Test^</h1^> >> test.html
echo ^<p^>If you can see this, the server is working!^</p^> >> test.html
echo ^<p^>Time: ^%date% %time%^</p^> >> test.html
echo ^</body^> >> test.html
echo ^</html^> >> test.html

echo.
echo Opening test.html directly in browser...
start test.html

echo.
echo Test file created. Opening in default browser...
pause
