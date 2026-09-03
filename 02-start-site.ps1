$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "Starting Dr Amr Elshamy website on http://localhost:3000" -ForegroundColor Cyan
Write-Host "Keep this window open while the client is viewing the site." -ForegroundColor Yellow
Write-Host ""

$env:NODE_ENV = "production"
npm run start
