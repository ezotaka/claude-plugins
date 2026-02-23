#!/bin/bash
set -euo pipefail

# English Tutor - Correction Logging Script
# Logs English corrections to SQLite database

# Database path: ~/.claude/english-tutor/english_study.db (shared across all workspaces)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(dirname "$SCRIPT_DIR")"
DB_DIR="$HOME/.claude/english-tutor"
DB_PATH="$DB_DIR/english_study.db"

# Create DB directory if needed
mkdir -p "$DB_DIR"

# Auto-migrate: move old DB from plugin root to new shared location (one-time)
OLD_DB_PATH="$PLUGIN_ROOT/english_study.db"
if [[ -f "$OLD_DB_PATH" && ! -f "$DB_PATH" ]]; then
  mv "$OLD_DB_PATH" "$DB_PATH" || { echo "Warning: failed to migrate old DB from $OLD_DB_PATH" >&2; }
fi

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

# Create database and tables if not exists
sqlite3 "$DB_PATH" <<EOF
CREATE TABLE IF NOT EXISTS english_sessions (
  id             TEXT PRIMARY KEY,
  original_text  TEXT NOT NULL,
  corrected_text TEXT NOT NULL,
  context        TEXT,
  work_folder    TEXT,
  created_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS english_corrections (
  id                 TEXT PRIMARY KEY,
  session_id         TEXT NOT NULL,
  category           TEXT NOT NULL,
  original_fragment  TEXT,
  corrected_fragment TEXT,
  explanation        TEXT NOT NULL,
  FOREIGN KEY(session_id) REFERENCES english_sessions(id)
);
EOF

# Generate UUIDs
generate_uuid() {
  if command -v uuidgen &> /dev/null; then
    uuidgen | tr '[:upper:]' '[:lower:]'
  else
    # Fallback: use random hex string
    local hex=$(cat /dev/urandom | LC_ALL=C tr -dc 'a-f0-9' | fold -w 32 | head -n 1)
    echo "${hex:0:8}-${hex:8:4}-${hex:12:4}-${hex:16:4}-${hex:20:12}"
  fi
}

SESSION_ID=$(generate_uuid)
CORRECTION_ID=$(generate_uuid)

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

# Insert log entry (simplified for script: one session, one Grammar correction)
sqlite3 "$DB_PATH" <<EOF
INSERT INTO english_sessions (id, original_text, corrected_text, context, work_folder, created_at)
VALUES ('$SESSION_ID', '$ORIGINAL_ESCAPED', '$CORRECTED_ESCAPED', '$CONTEXT_ESCAPED', '$WORK_FOLDER_ESCAPED', '$TIMESTAMP');

INSERT INTO english_corrections (id, session_id, category, original_fragment, corrected_fragment, explanation)
VALUES ('$CORRECTION_ID', '$SESSION_ID', 'Grammar', '$ORIGINAL_ESCAPED', '$CORRECTED_ESCAPED', '$EXPLANATION_ESCAPED');
EOF

# Output success (silent mode - only output on error)
# echo "Logged correction: $UUID" >&2
