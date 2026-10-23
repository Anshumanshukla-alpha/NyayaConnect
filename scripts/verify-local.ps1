param(
  [switch]$RunDocker
)
$ErrorActionPreference = 'Stop'
$ProjectRoot = Split-Path -Parent $PSScriptRoot
Push-Location $ProjectRoot
try {
  foreach ($tool in @('node','npm','java','mvn')) {
    if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
      throw "Required command '$tool' was not found. Install it and reopen PowerShell."
    }
  }
  Write-Host "== Version consistency ==" -ForegroundColor Cyan
  & (Join-Path $ProjectRoot 'scripts\verify-version.ps1')
  if ($LASTEXITCODE -ne 0) { throw "Version consistency check failed" }
  Write-Host "== Node / npm ==" -ForegroundColor Cyan
  node --version
  npm --version
  Write-Host "== Frontend dependency install ==" -ForegroundColor Cyan
  npm install
  if ($LASTEXITCODE -ne 0) { throw "npm install failed with exit code $LASTEXITCODE" }
  Write-Host "== Frontend typecheck ==" -ForegroundColor Cyan
  npm run typecheck
  if ($LASTEXITCODE -ne 0) { throw "Frontend typecheck failed with exit code $LASTEXITCODE" }
  Write-Host "== Frontend production build ==" -ForegroundColor Cyan
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "Frontend production build failed with exit code $LASTEXITCODE" }
  Write-Host "== Backend Maven verification ==" -ForegroundColor Cyan
  Push-Location (Join-Path $ProjectRoot 'backend')
  try { mvn clean verify; if ($LASTEXITCODE -ne 0) { throw "Backend Maven verification failed with exit code $LASTEXITCODE" } } finally { Pop-Location }
  if ($RunDocker) {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
      throw "Docker CLI not found. Install Docker Desktop or run without -RunDocker."
    }
    Write-Host "== Docker Compose integration startup ==" -ForegroundColor Cyan
    Push-Location (Join-Path $ProjectRoot 'backend')
    try {
      docker compose up --build -d
      $ready = $false
      for ($i=0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 5
        try {
          $health = Invoke-RestMethod 'http://localhost:8080/health' -TimeoutSec 4
          $readiness = Invoke-RestMethod 'http://localhost:8080/ready' -TimeoutSec 4
          if ($health.status -eq 'UP' -and $readiness.status -eq 'READY') { $ready = $true; break }
        } catch { }
      }
      if (-not $ready) {
        docker compose ps
        docker compose logs --tail 120 app mysql
        throw 'Docker services did not become healthy. Logs are printed above.'
      }
      Write-Host 'DOCKER_HEALTH=PASS' -ForegroundColor Green
      Write-Host 'DOCKER_READINESS=PASS' -ForegroundColor Green
      Write-Host 'Demo services are running. Stop them with: docker compose down' -ForegroundColor Yellow
    } finally { Pop-Location }
  }
  Write-Host 'LOCAL_VERIFICATION=PASS' -ForegroundColor Green
} finally { Pop-Location }
