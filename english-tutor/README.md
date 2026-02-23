# English Tutor Plugin for Claude Code

A Claude Code plugin that helps you learn English while you develop. It automatically corrects your English, provides explanations, and logs your learning progress to a local database.

## Features

- 🎯 **Automatic Correction**: Detects and corrects English errors in your messages
- 📚 **Learning Logs**: Saves all corrections to a local SQLite database for review
- 🧠 **Smart Detection**: Only activates when you write in English
- ⚙️ **Customizable**: Adjust correction level (off/gentle/moderate/strict)
- 🔒 **Privacy-First**: All data stays local on your machine

## Installation

### Prerequisites

- Claude Code
- SQLite (typically pre-installed on macOS/Linux)

### Setup

**Option 1: Install from Marketplace (Recommended)**

```bash
/plugin marketplace add ezotaka/claude-plugins
/plugin install english-tutor@ezotaka-plugins
```

**Option 2: Local Installation**

```bash
git clone https://github.com/ezotaka/claude-plugins.git
/plugin marketplace add ./claude-plugins
/plugin install english-tutor@ezotaka-plugins
```

No build step required! The plugin works out of the box.

## Configuration

Create a configuration file at `.claude/english-tutor.local.md`:

```yaml
---
correction_level: moderate  # off | gentle | moderate | strict
auto_log: true             # Save corrections to database
database_path: ""          # Custom DB path (empty = plugin directory)
---
```

### Correction Levels

- **off**: No automatic corrections
- **gentle**: Only critical grammar errors
- **moderate** (default): Grammar errors + slightly unnatural expressions
- **strict**: All improvements including native-like expressions

## Usage

### Automatic Correction

Simply write in English and Claude Code will automatically correct errors:

**Your input:**
```
I want to implementing a new feature
```

**Claude Code response:**
```
【English Correction】
"I want to implementing" → "I want to implement"
Explanation: After "want to", use the base form of the verb (infinitive)

Now, let me help you implement that feature...
```

## How It Works

1. **Detection**: Claude monitors your messages for English content
2. **Analysis**: Analyzes English for errors (grammar, naturalness)
3. **Correction**: Provides corrections with explanations
4. **Logging**: Saves to SQLite database via Bash script
5. **Learning**: Review your progress over time

## Architecture

```
english-tutor/
├── .claude-plugin/
│   └── plugin.json           # Plugin manifest
├── .claude-example/
│   └── english-tutor.local.md # Configuration example
├── commands/
│   └── english-tutor.md      # /english-tutor command
├── skills/
│   └── english-correction/   # English correction skill
│       ├── SKILL.md
│       ├── examples/
│       └── references/
├── scripts/
│   └── log-correction.sh     # Database logging script
└── README.md
```

## Development

### Database Location

By default, corrections are stored in `english-tutor/english_study.db`. You can customize this by setting the `DB_PATH` environment variable.

## Privacy & Data

- All corrections are stored locally in SQLite
- No data is sent to external servers
- Database location: `english-tutor/english_study.db` (or custom path)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Roadmap

- [ ] Commands for reviewing logs
- [ ] Statistics and learning analytics
- [ ] Export learning data
- [ ] Support for multiple languages
- [ ] Integration with spaced repetition systems
