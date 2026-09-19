#!/usr/bin/env bash
# Serve the deck locally so it renders in a browser and so tools/peercheck.js
# has a served copy to measure. Runs in the foreground as a visible terminal.
set -euo pipefail

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)"
exec http-server -p 8899 -s -c-1 .
