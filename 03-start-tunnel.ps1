$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "Starting public Cloudflare link for http://localhost:3000" -ForegroundColor Cyan
Write-Host "Keep this window open. Copy the https://...trycloudflare.com link and send it to the client." -ForegroundColor Yellow
Write-Host ""

if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
  Write-Host "cloudflared is not installed." -ForegroundColor Yellow
  Write-Host "Trying to install it using winget..." -ForegroundColor Gray
  winget install --id Cloudflare.cloudflared
}

cloudflared tunnel --url http://localhost:3000
