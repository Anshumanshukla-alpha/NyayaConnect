$ErrorActionPreference = 'Stop'
$expected = '5.2.1'
$pkg = Get-Content '.\package.json' -Raw | ConvertFrom-Json
if ($pkg.version -ne $expected) { throw "Frontend version is $($pkg.version), expected $expected" }
$pom = Get-Content '.\backend\pom.xml' -Raw
if ($pom -notmatch "<version>$expected</version>") { throw "Backend version is not $expected" }
Write-Host "VERSION_CHECK=PASS ($expected)" -ForegroundColor Green
