#!/bin/bash
set -euo pipefail

# English Tutor - Correction Logging Script
# Logs English corrections to SQLite database

# Default database path (relative to plugin root)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(dirname "$SCRIPT_DIR")"
DB_PATH="${DB_PATH:-$PLUGIN_ROOT/english_study.db}"

# Parse arguments
ORIGINAL_TEXT=""
CORRECTED_TEXT=""
EXPLANATION=""
CONTEXT=""
WORK_FOLDER=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --original)
      ORIGINAL_TEXT="$2"
      shift 2
      ;;
    --corrected)
      CORRECTED_TEXT="$2"
      shift 2
      ;;
    --explanation)
      EXPLANATION="$2"
      shift 2
      ;;
    --context)
      CONTEXT="$2"
      shift 2
      ;;
    --work-folder)
      WORK_FOLDER="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1" >&2
      exit 1
      ;;
  esac
done

# Validate required arguments
if [[ -z "$ORIGINAL_TEXT" ]] || [[ -z "$CORRECTED_TEXT" ]] || [[ -z "$EXPLANATION" ]]; then
  echo "Usage: $0 --original TEXT --corrected TEXT --explanation TEXT [--context TEXT]" >&2
  exit 1
fi

# Check for sqlite3
if ! command -v sqlite3 &> /dev/null; then
  echo "Error: sqlite3 command not found. Please install SQLite." >&2
  exit 1
fi

# Create database and table if not exists
sqlite3 "$DB_PATH" <<EOF
CREATE TABLE IF NOT EXISTS english_study_logs (
  id TEXT PRIMARY KEY,
  original_text TEXT NOT NULL,
  corrected_text TEXT NOT NULL,
  explanation TEXT NOT NULL,
  context TEXT,
  work_folder TEXT,
  created_at TEXT NOT NULL
);
EOF

# Generate UUID (macOS/Linux compatible)
if command -v uuidgen &> /dev/null; then
  UUID=$(uuidgen | tr '[:upper:]' '[:lower:]')
else
  # Fallback: use random hex string
  UUID=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-f0-9' | fold -w 32 | head -n 1)
  UUID="${UUID:0:8}-${UUID:8:4}-${UUID:12:4}-${UUID:16:4}-${UUID:20:12}"
fi

# Current timestamp in ISO 8601 format
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

# Escape single quotes for SQL
escape_sql() {
  echo "$1" | sed "s/'/''/g"
}

ORIGINAL_ESCAPED=$(escape_sql "$ORIGINAL_TEXT")
CORRECTED_ESCAPED=$(escape_sql "$CORRECTED_TEXT")
EXPLANATION_ESCAPED=$(escape_sql "$EXPLANATION")
CONTEXT_ESCAPED=$(escape_sql "$CONTEXT")
WORK_FOLDER_ESCAPED=$(escape_sql "$WORK_FOLDER")

# Insert log entry
sqlite3 "$DB_PATH" <<EOF
INSERT INTO english_study_logs (id, original_text, corrected_text, explanation, context, work_folder, created_at)
VALUES ('$UUID', '$ORIGINAL_ESCAPED', '$CORRECTED_ESCAPED', '$EXPLANATION_ESCAPED', '$CONTEXT_ESCAPED', '$WORK_FOLDER_ESCAPED', '$TIMESTAMP');
EOF

# Output success (silent mode - only output on error)
# echo "Logged correction: $UUID" >&2
