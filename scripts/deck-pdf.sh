#!/bin/sh
# Print an HTML slide deck to slides.pdf next to it, using headless Chrome.
# Usage (from the repo root): scripts/deck-pdf.sh comparative-politics-maspo-fall2026/091726
set -e
dir=${1%/}
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --no-pdf-header-footer --virtual-time-budget=15000 \
  --print-to-pdf="$dir/slides.pdf" "file://$PWD/$dir/index.html"
