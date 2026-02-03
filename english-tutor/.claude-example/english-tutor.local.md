---
# English Tutor Configuration
# Copy this file to .claude/english-tutor.local.md to customize settings

# Correction level: off | gentle | moderate | strict
# - off: No automatic corrections
# - gentle: Only critical grammar errors
# - moderate: Grammar errors + slightly unnatural expressions (default)
# - strict: All improvements including native-like expressions
correction_level: moderate

# Automatically save corrections to database
auto_log: true

# Custom database path (leave empty for default: plugin directory)
database_path: ""
---

# English Tutor Plugin Settings

This file controls how the English Tutor plugin behaves.

## Quick Setup

1. Copy this file to `.claude/english-tutor.local.md`
2. Adjust settings in the YAML frontmatter above
3. Restart Claude Code or start a new session

## Settings Explained

### correction_level

Controls how strict the corrections are:

- **off**: Disables automatic corrections completely
- **gentle**: Only shows critical errors that make text hard to understand
- **moderate** (recommended): Shows grammar mistakes and somewhat unnatural expressions
- **strict**: Provides detailed suggestions for more native-like English

### auto_log

When enabled, all corrections are saved to a local SQLite database for later review.

### database_path

By default, the database is stored in the plugin directory. You can specify a custom path here if you want to store it elsewhere (e.g., in a synced folder).

Example:
```yaml
database_path: "/Users/yourusername/Documents/english-learning/study.db"
```
