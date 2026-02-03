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

- Node.js (v18 or higher)
- Claude Code

### Setup

1. Clone this repository or install from Claude Code marketplace:
   ```bash
   # If installing locally
   git clone https://github.com/ezotaka/claude-plugins.git
   cd claude-plugins/english-tutor
   ```

2. Install MCP server dependencies:
   ```bash
   cd mcp-server
   npm install
   npm run build
   cd ..
   ```

3. Enable the plugin in Claude Code

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

### Review Learning Logs

(Commands will be added in future versions to review your learning history)

## How It Works

1. **Detection**: Hook monitors your messages for English content
2. **Analysis**: Agent analyzes English for errors (grammar, naturalness)
3. **Correction**: Provides corrections with explanations
4. **Logging**: Saves to SQLite database via MCP server
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
├── mcp-server/               # Database logging server
│   ├── src/
│   ├── dist/
│   └── package.json
├── .mcp.json                 # MCP server configuration
└── README.md
```

## Development

### Building the MCP Server

```bash
cd mcp-server
npm run build
```

### Testing

```bash
# Test the plugin with Claude Code
cc --plugin-dir /path/to/english-tutor
```

## Privacy & Data

- All corrections are stored locally in SQLite
- No data is sent to external servers
- Database location: `english-tutor/mcp-server/english_study.db` (or custom path)

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
