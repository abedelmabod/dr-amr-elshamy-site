# Dr Amr Elshamy Website - Run On Another PC

Use these steps on the PC that will stay on 24 hours.

## 1. Install Requirements

Install:

- Node.js 22 LTS or newer: https://nodejs.org/
- Git: https://git-scm.com/
- Cloudflare Tunnel:

```powershell
winget install --id Cloudflare.cloudflared
```

## 2. Copy The Project

Copy the whole project folder from the flash drive to a stable place, for example:

```powershell
C:\Sites\dr-amr-elshamy-site
```

## 3. Install And Build

Open PowerShell inside the project folder and run:

```powershell
.\01-install-and-build.ps1
```

Or run manually:

```powershell
npm install
npm run build
```

## 4. Start The Website

Open PowerShell inside the project folder and run:

```powershell
.\02-start-site.ps1
```

Keep this window open.

The local site will be:

```text
http://localhost:3000
```

## 5. Create A Public Link For The Client

Open another PowerShell window inside the project folder and run:

```powershell
.\03-start-tunnel.ps1
```

Copy the link that looks like:

```text
https://something.trycloudflare.com
```

Send this link to the client.

Admin link:

```text
https://something.trycloudflare.com/admin
```

## Important

- Keep the PC on.
- Keep both PowerShell windows open.
- Keep internet connected.
- The Cloudflare link changes when you close and reopen the tunnel.
- For final production, use a real VPS or a permanent Cloudflare Tunnel with a domain.
