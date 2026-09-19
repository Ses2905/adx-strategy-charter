#!/usr/bin/env bash
# Idempotent bootstrap for the Advertiser Experience deck repo.
#
# The repo ships two verification toolchains plus a static deck that renders in a
# browser:
#   - Python: tools/checkdeck.py (browserless structural check) and
#     tools/build_v2.py (themed .pptx export, needs python-pptx).
#   - Node:   tools/peercheck.js (peer-geometry check) which drives Playwright
#     against a locally served copy of the deck.
set -euo pipefail

# Resolve node/npm to the pinned nvm v22 toolchain even in a non-login shell.
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

echo "==> Python: python-pptx (tools/build_v2.py)"
python3 -m pip install --break-system-packages --quiet python-pptx

echo "==> Node: playwright + http-server (global)"
npm install -g playwright http-server

echo "==> Chromium browser + system libraries for headless rendering"
npx --yes playwright install chromium
sudo -E env "PATH=$PATH" npx --yes playwright install-deps chromium

# tools/peercheck.js require()s playwright from a hardcoded absolute path
# (/opt/node22/lib/node_modules/playwright). Point it at the global install so
# the tool runs unmodified.
echo "==> Symlink playwright for tools/peercheck.js"
GROOT="$(npm root -g)"
sudo mkdir -p /opt/node22/lib/node_modules
sudo ln -sfn "$GROOT/playwright" /opt/node22/lib/node_modules/playwright

echo "==> Install complete"
