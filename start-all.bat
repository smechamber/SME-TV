@echo off
setlocal

set "ROOT=%~dp0"

echo Starting SME-TV Web, Admin, API and Mobile...

start "SME-TV API - 4000" cmd /k "cd /d "%ROOT%apps\api" && npm run dev"
start "SME-TV Web - 3000" cmd /k "cd /d "%ROOT%apps\web" && npm run dev"
start "SME-TV Admin - 3001" cmd /k "cd /d "%ROOT%apps\admin" && npm run dev"
start "SME-TV Mobile - Expo" cmd /k "cd /d "%ROOT%apps\mobile" && npx expo start"

echo.
echo Web:    http://localhost:3000
echo Admin:  http://localhost:3001
echo API:    http://localhost:4000
echo Mobile: Expo terminal / Expo Go
echo.
echo Close the four opened terminals to stop the apps.

endlocal
