#!/usr/bin/env bash
set -euo pipefail

# Query GoatCounter for country breakdown of visitors to a given path
# on a single date.
#
# Setup:
#   Token is read from $GC_TOKEN (exported in ~/.bash_profile).
#
# Usage:
#   ./gc-locations.sh                         # /cv/, today (UTC)
#   ./gc-locations.sh /publications/          # today
#   ./gc-locations.sh /cv/ 2026-04-23         # specific date

SITE="${GC_SITE:-https://jihyepark.goatcounter.com}"
PATH_FILTER="${1:-/cv/}"
DATE="${2:-$(date -u +%Y-%m-%d)}"

if [[ -z "${GC_TOKEN:-}" ]]; then
  echo "error: GC_TOKEN is not set. Add 'export GC_TOKEN=...' to ~/.bash_profile and open a new shell." >&2
  exit 1
fi

echo "# site: $SITE"
echo "# path: $PATH_FILTER"
echo "# date: $DATE (UTC)"
echo

curl -sG "$SITE/api/v0/stats/locations" \
  -H "Authorization: Bearer $GC_TOKEN" \
  -H "Content-Type: application/json" \
  --data-urlencode "start=${DATE}T00:00:00Z" \
  --data-urlencode "end=${DATE}T23:59:59Z" \
  --data-urlencode "path_by_name=true" \
  --data-urlencode "include_paths=${PATH_FILTER}" \
  --data-urlencode "limit=100" \
  | jq -r '.stats[]? | "\(.count)\t\(.id)\t\(.name)"' \
  | sort -rn \
  | awk 'BEGIN{printf "%-6s %-4s %s\n", "count", "iso", "country"} {printf "%-6s %-4s ", $1, $2; $1=""; $2=""; sub(/^  /,""); print}'
