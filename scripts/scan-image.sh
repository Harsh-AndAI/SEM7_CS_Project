#!/usr/bin/env bash
# ==============================================================================
# Container Image Vulnerability Scanner (Bash)
# Using Aqua Security Trivy via Docker container
# Meets College Guideline 8: Image Vulnerability Scanning
# ==============================================================================

set -e

IMAGE_NAME="cloud-vault-app:v1"
REPORT_FILE="VULNERABILITY_SCAN_REPORT.md"

echo "=========================================================="
echo " CloudSecure Vault - Docker Container Vulnerability Scan  "
echo "=========================================================="

echo -e "\nScanning Docker image '$IMAGE_NAME' using Trivy for HIGH and CRITICAL vulnerabilities..."
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image \
  --severity HIGH,CRITICAL \
  --format table \
  "$IMAGE_NAME" | tee "$REPORT_FILE"

echo -e "\nScan completed! Full scan results saved to $REPORT_FILE"
