#!/bin/bash
set -e

# Run Gitleaks
if command -v gitleaks >/dev/null 2>&1; then
  echo "Running Gitleaks..."
  gitleaks detect --source . --report-path gitleaks-report.json --report-format json || true
  echo "Gitleaks scan complete. Results saved to gitleaks-report.json."
else
  echo "Gitleaks not found. Please install it first."
fi

# Run TruffleHog
if command -v trufflehog >/dev/null 2>&1; then
  echo "Running TruffleHog..."
  trufflehog git file://$PWD --json > trufflehog-report.json || true
  echo "TruffleHog scan complete. Results saved to trufflehog-report.json."
else
  echo "TruffleHog not found. Please install it first."
fi

echo "Secret scanning complete. Review gitleaks-report.json and trufflehog-report.json for findings." 