@echo off
powershell -NoProfile -Command "Start-Process php -ArgumentList '-S','127.0.0.1:8000','-t','public' -WindowStyle Minimized"
echo [dev] PHP server: http://127.0.0.1:8000
powershell -NoProfile -Command "Start-Process bun -ArgumentList 'run','--bun','vite' -WindowStyle Minimized"
echo [dev] Vite server: http://localhost:5173
echo [dev] Servers running in minimized windows. Close them when done.
