#!/usr/bin/env bash
# Copy an aligned/frozen Advertiser Experience deck into docs/ and push it
# to GitHub Pages. Run this only after a version is frozen — not on every save.
#
# Usage:
#   scripts/publish-deck.sh
#   scripts/publish-deck.sh /path/to/export-or-frozen-folder
#   scripts/publish-deck.sh --dry-run /path/to/folder
#
# Default source is the frozen live deck on this machine:
#   ~/.claude/plugins/marketplaces/local-desktop-app-uploads/html-presentation-toolkit/previews/editorial-blue
#
# Never copies layout-test/, experiments, starter-kit, or kit-v1 compare.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/docs"
DEFAULT_SRC="${DECK_SRC:-$HOME/.claude/plugins/marketplaces/local-desktop-app-uploads/html-presentation-toolkit/previews/editorial-blue}"

DRY_RUN=0
SRC=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    --help|-h)
      sed -n '2,16p' "$0"
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
SRC="${SRC:-$DEFAULT_SRC}"

if [[ ! -d "$SRC" ]]; then
  echo "Source folder not found: $SRC" >&2
  exit 1
fi

# Export packs sometimes wrap index.html in a nested folder.
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

case "$SRC" in
  *layout-test*|*starter-kit*|*kit-v1*|*experiments*)
    echo "Refusing to publish from $SRC (layout-test / starter-kit / kit-v1 / experiments stay off Pages)." >&2
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

copy_if_present index.html
copy_if_present layout-system.css
copy_if_present layout-system.js
copy_if_present review.css
copy_if_present review.js
copy_if_present extra.css

if [[ -d "$SRC/fonts" ]]; then
  mkdir -p "$TMP/fonts"
  rsync -a "$SRC/fonts/" "$TMP/fonts/"
fi
if [[ -d "$SRC/logos" ]]; then
  mkdir -p "$TMP/logos"
  rsync -a "$SRC/logos/" "$TMP/logos/"
fi

touch "$TMP/.nojekyll"

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
included: index.html, layout-system.css/js, review.css/js, extra.css (if present), fonts/, logos/
not_included: layout-test, experiments, starter-kit, kit-v1
EOF

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "Dry run — files that would be published:"
  find "$TMP" -type f | sort
  exit 0
fi

mkdir -p "$DEST"
# Keep VERSION we just wrote; replace the rest of the published tree.
rsync -a --delete \
  --exclude '.DS_Store' \
  "$TMP/" "$DEST/"

cd "$ROOT"
git add docs scripts/publish-deck.sh README.md .github/workflows/pages.yml
if [[ -f .github/workflows/jekyll-gh-pages.yml ]]; then
  git rm -f .github/workflows/jekyll-gh-pages.yml
fi

if git diff --cached --quiet; then
  echo "No changes to publish."
  exit 0
fi

git commit -m "$(cat <<EOF
Publish aligned deck ${STAMP_FILE}

Replace GitHub Pages with the frozen Advertiser Experience HTML deck.
EOF
)"

git push origin HEAD:main
echo
echo "Pushed. Live URL: https://ses2905.github.io/adx-strategy-charter/"
echo "Pages may take a minute to rebuild."
