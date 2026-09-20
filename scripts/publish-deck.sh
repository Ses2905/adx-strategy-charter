#!/usr/bin/env bash
# Copy an aligned Advertiser Experience deck into docs/ and push it to
# GitHub Pages. Run this only after a version is aligned — not on every save.
#
# Usage:
#   scripts/publish-deck.sh
#   scripts/publish-deck.sh /path/to/working-or-export-folder
#   scripts/publish-deck.sh --dry-run
#   scripts/publish-deck.sh --revert-archive   # publish the frozen 8793 backup
#
# Default source is the WORKING deck:
#   ~/.claude/plugins/marketplaces/local-desktop-app-uploads/html-presentation-toolkit/previews/editorial-blue-kit-v1
#
# The frozen original is a revert backup only (do not edit it):
#   ~/.claude/plugins/marketplaces/local-desktop-app-uploads/html-presentation-toolkit/previews/editorial-blue
#
# Never copies layout-test/, presentation-starter-kit, _qa/, or other experiments.
# Push credentials: reads gitignored $ROOT/.github-token if GH_TOKEN is unset. Never echoes it.


set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/docs"
WORKING_SRC="${DECK_SRC:-$HOME/.claude/plugins/marketplaces/local-desktop-app-uploads/html-presentation-toolkit/previews/editorial-blue-kit-v1}"
ARCHIVE_SRC="$HOME/.claude/plugins/marketplaces/local-desktop-app-uploads/html-presentation-toolkit/previews/editorial-blue"

DRY_RUN=0
REVERT_ARCHIVE=0
SRC=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --revert-archive) REVERT_ARCHIVE=1 ;;
    --help|-h)
      sed -n '2,20p' "$0"
      exit 0
      ;;
    *)
      if [[ -n "$SRC" ]]; then
        echo "Unexpected extra argument: $arg" >&2
        exit 1
      fi
      SRC="$arg"
      ;;
  esac
done

if [[ "$REVERT_ARCHIVE" -eq 1 && -z "$SRC" ]]; then
  SRC="$ARCHIVE_SRC"
fi
SRC="${SRC:-$WORKING_SRC}"

if [[ ! -d "$SRC" ]]; then
  echo "Source folder not found: $SRC" >&2
  exit 1
fi

if [[ ! -f "$SRC/index.html" ]]; then
  INNER="$(find "$SRC" -mindepth 1 -maxdepth 3 -name index.html | head -n 1 || true)"
  if [[ -n "$INNER" ]]; then
    SRC="$(cd "$(dirname "$INNER")" && pwd)"
  fi
fi

if [[ ! -f "$SRC/index.html" ]]; then
  echo "No index.html under $SRC" >&2
  exit 1
fi

# Allow the working kit-v1 deck and an explicit archive revert.
# Block starter-kit / layout-test / other experiments.
case "$SRC" in
  *presentation-starter-kit*|*layout-test*|*experiments*)
    echo "Refusing to publish from $SRC (starter-kit / layout-test / experiments stay off Pages)." >&2
    exit 1
    ;;
esac

STAMP="$(date '+%Y-%m-%d %H:%M')"
STAMP_FILE="$(date '+%Y-%m-%d-%H%M')"

echo "Source: $SRC"
echo "Dest:   $DEST"
echo "When:   $STAMP"

TMP="$(mktemp -d "${TMPDIR:-/tmp}/adx-deck-publish.XXXXXX")"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

copy_if_present() {
  local name="$1"
  if [[ -f "$SRC/$name" ]]; then
    cp "$SRC/$name" "$TMP/$name"
  fi
}

copy_dir_if_present() {
  local name="$1"
  if [[ -d "$SRC/$name" ]]; then
    mkdir -p "$TMP/$name"
    rsync -a --exclude '.DS_Store' "$SRC/$name/" "$TMP/$name/"
  fi
}

copy_if_present index.html
copy_if_present layout-system.css
copy_if_present layout-system.js
copy_if_present review.css
copy_if_present review.js
copy_if_present extra.css

copy_dir_if_present css
copy_dir_if_present js
copy_dir_if_present theme
copy_dir_if_present fonts
copy_dir_if_present logos
# Never publish QA captures or notes.
rm -rf "$TMP/_qa" "$TMP/COMPARE.txt" "$TMP/SOURCE-OF-TRUTH.md"

touch "$TMP/.nojekyll"

if [[ ! -f "$TMP/index.html" ]]; then
  echo "Copy failed: index.html missing" >&2
  exit 1
fi
if ! grep -q 'layout-system.css' "$TMP/index.html"; then
  echo "index.html does not reference layout-system.css — aborting." >&2
  exit 1
fi
if grep -E '127\.0\.0\.1|localhost|file://' "$TMP/index.html" >/dev/null; then
  echo "index.html contains a local path — aborting." >&2
  exit 1
fi

cat > "$TMP/VERSION" << EOF
published: $STAMP
source: $SRC
working_default: editorial-blue-kit-v1 (http://127.0.0.1:8795/)
archive_backup: editorial-blue (http://127.0.0.1:8793/) — revert only, do not edit
included: index.html, review.css/js, layout-system.js, css/, js/, theme/, fonts/, logos/
not_included: layout-test, presentation-starter-kit, experiments, COMPARE.txt, _qa
EOF

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Dry run — files that would be published:"
  find "$TMP" -type f | sort
  exit 0
fi

mkdir -p "$DEST"
rsync -a --delete \
  --exclude '.DS_Store' \
  "$TMP/" "$DEST/"

cd "$ROOT"
git add docs scripts/publish-deck.sh README.md .github/workflows/pages.yml .gitignore
if [[ -f .github/workflows/jekyll-gh-pages.yml ]]; then
  git rm -f .github/workflows/jekyll-gh-pages.yml
fi

if git diff --cached --quiet; then
  echo "No changes to publish."
  exit 0
fi

git commit -m "$(cat <<EOF
Publish aligned deck ${STAMP_FILE}

Replace GitHub Pages with the working Advertiser Experience HTML deck from editorial-blue-kit-v1.
EOF
)"

load_push_token() {
  if [[ -n "${GH_TOKEN:-}" || -n "${GITHUB_TOKEN:-}" ]]; then
    export GH_TOKEN="${GH_TOKEN:-$GITHUB_TOKEN}"
    export GITHUB_TOKEN="${GITHUB_TOKEN:-$GH_TOKEN}"
    return 0
  fi
  local token_file="$ROOT/.github-token"
  if [[ -f "$token_file" ]]; then
    GH_TOKEN="$(tr -d '[:space:]' < "$token_file")"
    export GH_TOKEN
    export GITHUB_TOKEN="$GH_TOKEN"
  fi
}

push_main() {
  load_push_token
  if [[ -z "${GH_TOKEN:-}" ]]; then
    git push origin HEAD:main
    return
  fi
  local ask
  ask="$(mktemp)"
  chmod 700 "$ask"
  cat > "$ask" << 'EOF'
#!/bin/sh
case "$1" in
  *Username*) echo "x-access-token" ;;
  *) echo "$GH_TOKEN" ;;
esac
EOF
  GIT_TERMINAL_PROMPT=0 GIT_ASKPASS="$ask" git -c credential.helper= push origin HEAD:main
  rm -f "$ask"
}

push_main
echo
echo "Pushed. Live URL: https://ses2905.github.io/adx-strategy-charter/"
echo "Pages may take a minute to rebuild."
