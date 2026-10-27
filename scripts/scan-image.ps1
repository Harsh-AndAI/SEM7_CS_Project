# ==============================================================================
# Container Image Vulnerability Scanner (PowerShell)
# Using Aqua Security Trivy via Docker container
# Meets College Guideline 8: Image Vulnerability Scanning
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " CloudSecure Vault - Docker Container Vulnerability Scan  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ImageName = "cloud-vault-app:v1"
$ReportFile = "VULNERABILITY_SCAN_REPORT.md"

Write-Host "`nScanning Docker image '$ImageName' for HIGH and CRITICAL vulnerabilities..." -ForegroundColor Yellow

# Run Trivy scanner container
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image `
    --severity HIGH,CRITICAL `
    --format table `
    $ImageName | Tee-Object -FilePath $ReportFile

Write-Host "`nScan completed! Full scan results saved to $ReportFile" -ForegroundColor Green
