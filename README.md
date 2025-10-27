# Mermaid Lint MCP

[中文版本](README_zh.md) | **English**

A powerful tool for validating Mermaid diagrams with both CLI and MCP server capabilities. Perfect for developers, technical writers, and AI assistants who work with Mermaid diagrams.

## 🚀 Quick Start

### Install and Use Immediately

```bash
# Validate a Mermaid file
npx mermaid-lint-mcp lint diagram.mmd

# Validate Mermaid code directly
npx mermaid-lint-mcp lint --code "graph TD; A-->B"

# Start MCP server for AI assistants
npx mermaid-lint-mcp server

# Get help
npx mermaid-lint-mcp --help
```

No installation required! The tool will be downloaded automatically on first use.

## 🎯 Use Cases

### For Developers
- **Pre-commit validation**: Ensure all Mermaid diagrams in your codebase are valid
- **CI/CD integration**: Add diagram validation to your build pipeline
- **Documentation quality**: Catch syntax errors before publishing docs

### For Technical Writers
- **Content validation**: Verify diagrams render correctly before publication
- **Error debugging**: Get clear error messages for syntax issues

### For AI Assistants
- **Real-time validation**: Validate generated diagrams instantly
- **MCP integration**: Seamless integration with Claude Code, Cursor, Trae, and other AI tools
- **Automated workflows**: Enable AI to self-validate diagram outputs

## 📋 Features

- ✅ **Fast Validation**: Optimized for speed with browser reuse and local libraries
- ✅ **Multiple Formats**: Support for all Mermaid diagram types
- ✅ **Dual Interface**: Both CLI tool and MCP server in one package
- ✅ **Error Details**: Clear error messages with line numbers and suggestions
- ✅ **Timeout Control**: Configurable validation timeouts
- ✅ **Zero Config**: Works out of the box

## 🛠️ Installation Options

### Option 1: Use with npx (Recommended)
No installation needed - just use `npx mermaid-lint-mcp` directly.

### Option 2: Global Installation
```bash
npm install -g mermaid-lint-mcp
# Then use: mermaid-lint-mcp
```

### Option 3: Local Project Installation
```bash
npm install mermaid-lint-mcp
# Then use: npx mermaid-lint-mcp
```

## 📖 Usage Guide

### CLI Commands

#### Validate Diagrams
```bash
# Validate a file
npx mermaid-lint-mcp lint diagram.mmd
npx mermaid-lint-mcp diagram.mmd  # 'lint' is default

# Validate code string
npx mermaid-lint-mcp lint --code "graph TD; A-->B"

# With custom timeout (5 seconds)
npx mermaid-lint-mcp lint --timeout 5000 diagram.mmd

# Validate with file option
npx mermaid-lint-mcp lint --file diagram.mmd
```

#### Start MCP Server
```bash
# Start server for AI assistant integration
npx mermaid-lint-mcp server
```

#### Get Help
```bash
npx mermaid-lint-mcp --help     # Show all commands
npx mermaid-lint-mcp --version  # Show version
```

### MCP Server Integration

#### For Claude Desktop
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "mermaid-lint": {
      "command": "npx",
      "args": ["mermaid-lint-mcp", "server"]
    }
  }
}
```

#### For Other MCP Clients, the setup is similar to above, please refer to the official documentation

## 📊 Supported Diagram Types

| Type | Syntax | Example |
|------|--------|---------|
| Flowchart | `flowchart TD` | Decision trees, processes |
| Sequence | `sequenceDiagram` | API interactions, workflows |
| Class | `classDiagram` | Object relationships |
| State | `stateDiagram-v2` | State machines |
| ER | `erDiagram` | Database schemas |
| Gantt | `gantt` | Project timelines |
| Pie | `pie` | Data visualization |
| Journey | `journey` | User experiences |
| Git Graph | `gitgraph` | Version control flows |
| ... | `...` | ... |

## 🔧 Configuration

### Browser Setup

This tool uses Puppeteer to validate Mermaid diagrams, which requires a browser. You have several options:

#### Option 1: Use System Browser (Recommended)
```bash
# macOS with Chrome
npx mermaid-lint-mcp --browser-path "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --code "graph TD; A-->B"

# Linux with Chromium
npx mermaid-lint-mcp --browser-path "/usr/bin/chromium-browser" --code "graph TD; A-->B"

# Windows with Chrome
npx mermaid-lint-mcp --browser-path "C:\Program Files\Google\Chrome\Application\chrome.exe" --code "graph TD; A-->B"
```

#### Option 2: Install Puppeteer's Chromium
```bash
# Install Chromium for Puppeteer
npx puppeteer browsers install chrome

# Then use normally
npx mermaid-lint-mcp --code "graph TD; A-->B"
```

#### Option 3: Skip Download and Use Browser Path
If you have network issues during installation, the package is configured to skip Chromium download automatically. Just use the `--browser-path` option.

### Validation Options
```typescript
interface ValidationOptions {
  timeout?: number;     // Timeout in milliseconds (default: 5000)
  browserPath?: string; // Path to custom browser executable
}
```

### Environment Variables
```bash
# Set default timeout
export MERMAID_TIMEOUT=10000

# Enable debug logging
export DEBUG=mermaid-lint-mcp
```

## 🔍 Example Outputs

### Valid Diagram
```json
{
  "isValid": true,
  "error": null,
  "diagramType": "flowchart"
}
```

### Invalid Diagram
```json
{
  "isValid": false,
  "error": "Parse error on line 8: ...> C E --> F[End ---------------------^ Expecting 'SQE', 'DOUBLECIRCLEEND', 'PE', '-)', 'STADIUMEND', 'SUBROUTINEEND', 'PIPE', 'CYLINDEREND', 'DIAMOND_STOP', 'TAGEND', 'TRAPEND', 'INVTRAPEND', 'UNICODE_TEXT', 'TEXT', 'TAGSTART', got '1'",
  "diagramType": "flowchart"
}
```

### CLI Output
```bash
$ npx mermaid-lint-mcp lint --code "graph TD; A-->B"
🔍 Validating Mermaid diagram...
✅ Diagram is valid!
📊 Diagram type: flowchart
```

## 🚨 Common Issues & Solutions

### Issue: "Command not found"
**Solution**: Use `npx mermaid-lint-mcp` instead of `mermaid-lint-mcp`

### Issue: Validation timeout
**Solution**: Increase timeout with `--timeout 10000`

### Issue: Permission denied
**Solution**: Run with appropriate permissions or use `npx`

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📖 [Documentation](https://github.com/yaodebian/mermaid-lint-mcp)
- 🐛 [Report Issues](https://github.com/yaodebian/mermaid-lint-mcp/issues)
- 💬 [Discussions](https://github.com/yaodebian/mermaid-lint-mcp/discussions)

## 🔗 Related Tools

- [Mermaid](https://mermaid.js.org/) - Create diagrams with text
- [Mermaid Live Editor](https://mermaid.live/) - Online diagram editor
- [Model Context Protocol](https://modelcontextprotocol.io/) - AI integration standard