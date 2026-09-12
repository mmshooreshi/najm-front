#!/usr/bin/env bash
# ==============================================================================
# Najm-Front Page Restore Utility
# Usage:
#   bash extra/restore_page.sh --list            # List all archived files & dirs
#   bash extra/restore_page.sh admin             # Restore pages/admin directory
#   bash extra/restore_page.sh dashboard         # Restore pages/dashboard directory
#   bash extra/restore_page.sh drag.vue          # Restore a specific prototype page
#   bash extra/restore_page.sh layout:admin.vue  # Restore a layout
# ==============================================================================

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ARCHIVE_DIR="$ROOT_DIR/.archive"
PAGES_DIR="$ROOT_DIR/pages"
LAYOUTS_DIR="$ROOT_DIR/layouts"

if [ ! -d "$ARCHIVE_DIR" ]; then
  echo "❌ Error: Archive directory '$ARCHIVE_DIR' not found."
  exit 1
fi

TARGET="$1"

if [ -z "$TARGET" ] || [ "$TARGET" = "--list" ] || [ "$TARGET" = "-l" ]; then
  echo "📦 Archived Items Available for Restoration:"
  echo ""
  echo "--- 1. Deprecated Admin & Dashboard Directories ---"
  [ -d "$ARCHIVE_DIR/pages/admin" ] && echo "  - admin        (.archive/pages/admin)"
  [ -d "$ARCHIVE_DIR/pages/dashboard" ] && echo "  - dashboard    (.archive/pages/dashboard)"
  echo ""
  echo "--- 2. Archived Layouts ---"
  if [ -d "$ARCHIVE_DIR/layouts" ]; then
    for f in "$ARCHIVE_DIR/layouts"/*; do
      [ -e "$f" ] && echo "  - layout:$(basename "$f")"
    done
  fi
  echo ""
  echo "--- 3. Archived Prototypes & Scratch Pages ---"
  if [ -d "$ARCHIVE_DIR/pages/prototypes" ]; then
    for f in "$ARCHIVE_DIR/pages/prototypes"/*; do
      [ -e "$f" ] && echo "  - $(basename "$f")"
    done
  fi
  echo ""
  echo "👉 To restore an item, run:"
  echo "   bash extra/restore_page.sh <name>"
  echo "   Example: bash extra/restore_page.sh admin"
  echo "   Example: bash extra/restore_page.sh drag.vue"
  exit 0
fi

# 1. Check if target is admin or dashboard
if [ "$TARGET" = "admin" ] || [ "$TARGET" = "pages/admin" ]; then
  if [ ! -d "$ARCHIVE_DIR/pages/admin" ]; then
    echo "❌ '$ARCHIVE_DIR/pages/admin' does not exist."
    exit 1
  fi
  echo "🔄 Restoring 'admin' directory to '$PAGES_DIR/admin'..."
  cp -r "$ARCHIVE_DIR/pages/admin" "$PAGES_DIR/"
  echo "✅ Restored successfully to '$PAGES_DIR/admin'."
  exit 0
fi

if [ "$TARGET" = "dashboard" ] || [ "$TARGET" = "pages/dashboard" ]; then
  if [ ! -d "$ARCHIVE_DIR/pages/dashboard" ]; then
    echo "❌ '$ARCHIVE_DIR/pages/dashboard' does not exist."
    exit 1
  fi
  echo "🔄 Restoring 'dashboard' directory to '$PAGES_DIR/dashboard'..."
  cp -r "$ARCHIVE_DIR/pages/dashboard" "$PAGES_DIR/"
  echo "✅ Restored successfully to '$PAGES_DIR/dashboard'."
  exit 0
fi

# 2. Check if target is a layout
if [[ "$TARGET" =~ ^layout:(.*)$ ]]; then
  LAYOUT_NAME="${BASH_REMATCH[1]}"
  if [ ! -f "$ARCHIVE_DIR/layouts/$LAYOUT_NAME" ]; then
    echo "❌ Layout '$LAYOUT_NAME' not found in '$ARCHIVE_DIR/layouts'."
    exit 1
  fi
  echo "🔄 Restoring layout '$LAYOUT_NAME' to '$LAYOUT_DIR/$LAYOUT_NAME'..."
  cp "$ARCHIVE_DIR/layouts/$LAYOUT_NAME" "$LAYOUTS_DIR/"
  echo "✅ Restored successfully to '$LAYOUTS_DIR/$LAYOUT_NAME'."
  exit 0
fi

# 3. Check if target is in prototypes (with or without .vue extension)
PROTOTYPE_FILE="$TARGET"
if [ ! -e "$ARCHIVE_DIR/pages/prototypes/$PROTOTYPE_FILE" ]; then
  if [ -e "$ARCHIVE_DIR/pages/prototypes/${TARGET}.vue" ]; then
    PROTOTYPE_FILE="${TARGET}.vue"
  fi
fi

if [ -e "$ARCHIVE_DIR/pages/prototypes/$PROTOTYPE_FILE" ]; then
  echo "🔄 Restoring '$PROTOTYPE_FILE' to '$PAGES_DIR/$PROTOTYPE_FILE'..."
  cp -r "$ARCHIVE_DIR/pages/prototypes/$PROTOTYPE_FILE" "$PAGES_DIR/"
  echo "✅ Restored successfully to '$PAGES_DIR/$PROTOTYPE_FILE'."
  exit 0
fi

echo "❌ Could not find '$TARGET' in .archive/. Run 'bash extra/restore_page.sh --list' to see available items."
exit 1
