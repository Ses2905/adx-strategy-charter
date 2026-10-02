#!/usr/bin/env bash
# Rebuild the master template end to end (needs node + pptxgenjs + sharp, python3 + pymupdf + pillow, LibreOffice).
set -euo pipefail
cd "$(dirname "$0")"
node build.js                      # pass 1: no thumbnails
python3 post.py
python3 thumbs.py /tmp/mt-thumbs   # render the worked examples
node build.js /tmp/mt-thumbs/thumbs.json   # pass 2: catalog with thumbnails
python3 post.py
