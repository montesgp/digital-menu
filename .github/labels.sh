#!/usr/bin/env bash
# Sync GitHub labels with .github/labels.json using the GitHub CLI.
# Usage: gh auth login && bash .github/labels.sh
# Requires: gh (>= 2.0) and jq.

set -euo pipefail

REPO="montesgp/digital-menu"
LABELS_FILE=".github/labels.json"

if ! command -v gh >/dev/null 2>&1; then
  echo "error: gh CLI is required." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required." >&2
  exit 1
fi

if ! gh repo view "$REPO" >/dev/null 2>&1; then
  echo "error: cannot access repository $REPO. Run 'gh auth login' first." >&2
  exit 1
fi

jq -c '.[]' "$LABELS_FILE" | while read -r label; do
  name=$(jq -r '.name' <<< "$label")
  color=$(jq -r '.color' <<< "$label")
  description=$(jq -r '.description' <<< "$label")
  echo "syncing label: $name"
  gh label create "$name" \
    --repo "$REPO" \
    --color "$color" \
    --description "$description" \
    --force
done

echo "Labels synced."