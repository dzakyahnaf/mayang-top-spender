$phpJob = Start-Process php -ArgumentList "-S","127.0.0.1:8000","-t","public" -PassThru -NoNewWindow
Write-Host "PHP server started on http://127.0.0.1:8000 (PID: $($phpJob.Id))" -ForegroundColor Cyan
Write-Host "Starting Vite... (Ctrl+C to stop both)" -ForegroundColor Cyan
try {
    npm run dev
} finally {
    Stop-Process -Id $phpJob.Id -Force -ErrorAction SilentlyContinue
    Write-Host "Servers stopped." -ForegroundColor Yellow
}
