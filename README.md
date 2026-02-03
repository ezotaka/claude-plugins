# Claude Code Plugins

A collection of Claude Code plugins to enhance your development workflow.

## 🚀 Quick Start

Add this marketplace to Claude Code:

```bash
/plugin marketplace add ezotaka/claude-plugins
```

Then install plugins:

```bash
/plugin install english-tutor@ezotaka-plugins
```

## 📦 Available Plugins

### 🎯 [English Tutor](./english-tutor) v0.1.0

Real-time English learning assistant that corrects your English while you develop.

**Features:**
- ✅ Automatic grammar correction with explanations
- ✅ Learning logs saved to local SQLite database
- ✅ Customizable correction levels (off/gentle/moderate/strict)
- ✅ Privacy-first: all data stays local

**Installation:**
```bash
/plugin install english-tutor@ezotaka-plugins
```

[📖 Documentation](./english-tutor/README.md)

---

## 💡 Future Plugins

Coming soon:
- Code review assistant
- Commit message generator
- Documentation builder
- Technical writing assistant

## 🛠️ Development

### Repository Structure

```
claude-plugins/
├── .claude-plugin/
│   └── marketplace.json    # Marketplace catalog
├── english-tutor/          # English learning plugin
├── future-plugin/          # Additional plugins
└── README.md
```

### Local Installation

For development or testing:

```bash
git clone https://github.com/ezotaka/claude-plugins.git
/plugin marketplace add ./claude-plugins
/plugin install english-tutor@ezotaka-plugins
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

Each plugin is licensed individually. See the LICENSE file in each plugin directory.

## Roadmap

Future plugins planned:
- Code review assistant
- Commit message generator
- Documentation builder
- ... and more!
