#!/usr/bin/env bash
# Build the client and prove no server secret is present in the shipped bundle.
# Run:  bash scripts/verify-no-secrets.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/frontend"

echo "==> Building client bundle…"
npx vite build >/tmp/meyaar-build.log 2>&1 || { echo "build failed"; tail -20 /tmp/meyaar-build.log; exit 1; }

DIST="$ROOT/frontend/dist"
echo "==> Scanning $DIST for secret material…"

# Patterns that must NEVER appear in client output.
PATTERNS=(
  "service_role"
  "SUPABASE_SERVICE_ROLE_KEY"
  "sk_live_"
  "sk_test_"
  "STRIPE_SECRET"
  "whsec_"
)

FAIL=0
for p in "${PATTERNS[@]}"; do
  if grep -rqi "$p" "$DIST" 2>/dev/null; then
    echo "  ❌ FOUND forbidden pattern in bundle: $p"
    FAIL=1
  else
    echo "  ✓ absent: $p"
  fi
done

if [ "$FAIL" -ne 0 ]; then
  echo "RESULT: FAIL — secrets present in client bundle."
  exit 1
fi
echo "RESULT: PASS — no secrets in client bundle."
