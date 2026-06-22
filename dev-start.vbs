Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "php -S 127.0.0.1:8000 -t public", 0, False
WScript.Sleep 1000  
WshShell.Run "bun run --bun vite", 0, False
WScript.Echo "Servers started on http://127.0.0.1:8000"
