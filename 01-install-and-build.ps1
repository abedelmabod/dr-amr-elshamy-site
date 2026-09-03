$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "Dr Amr Elshamy website - install and build" -ForegroundColor Cyan
Write-Host "This step installs the project packages and prepares the site." -ForegroundColor Gray
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  Write-Host "Node.js is not installed. Install Node.js 22 LTS first, then run this file again." -ForegroundColor Red
  Write-Host "Download: https://nodejs.org/" -ForegroundColor Yellow
  exit 1
}

if (-not (Test-Path ".env.local")) {
  Copy-Item ".env.example" ".env.local"
  Write-Host ".env.local was created from .env.example. Open it and add the real values before continuing." -ForegroundColor Yellow
  exit 1
}

npm install
npm run build

Write-Host ""
Write-Host "Done. Now run 02-start-site.ps1 and keep it open." -ForegroundColor Green
