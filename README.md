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
- **Batch processing**: Validate multiple diagram files at once
- **Error debugging**: Get clear error messages for syntax issues

### For AI Assistants
- **Real-time validation**: Validate generated diagrams instantly
- **MCP integration**: Seamless integration with Claude, ChatGPT, and other AI tools
- **Automated workflows**: Enable AI to self-validate diagram outputs

## 📋 Features

- ✅ **Fast Validation**: Optimized for speed with browser reuse and local libraries
- ✅ **Multiple Formats**: Support for all Mermaid diagram types
- ✅ **Dual Interface**: Both CLI tool and MCP server in one package
- ✅ **Error Details**: Clear error messages with line numbers and suggestions
- ✅ **Timeout Control**: Configurable validation timeouts
- ✅ **Zero Config**: Works out of the box with sensible defaults

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

#### For Other MCP Clients
```json
{
  "mcpServers": {
    "mermaid-lint": {
      "command": "node",
      "args": ["/path/to/global/node_modules/mermaid-lint-mcp/dist/cli.js", "server"]
    }
  }
}
```

### Programmatic Usage

```typescript
import { MermaidLinter } from 'mermaid-lint-mcp';

const linter = new MermaidLinter();

// Validate a diagram
const result = await linter.validateDiagram(`
  flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Success]
    B -->|No| D[Retry]
    D --> A
`, { timeout: 10000 });

console.log('Valid:', result.isValid);
console.log('Type:', result.diagramType);
if (!result.isValid) {
  console.log('Error:', result.error);
}

// Don't forget to cleanup
await linter.cleanup();
```

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

### Validation Options
```typescript
interface ValidationOptions {
  timeout?: number;  // Timeout in milliseconds (default: 5000)
}
```

### Environment Variables
```bash
# Set default timeout
export MERMAID_TIMEOUT=10000

# Enable debug logging
export DEBUG=mermaid-lint-mcp
```

## 📈 Performance

Optimized for production use:

- **First validation**: ~700ms (includes browser startup)
- **Subsequent validations**: ~10-25ms each
- **Memory efficient**: Proper cleanup prevents memory leaks
- **Browser reuse**: Shared browser instance across validations

## 🔍 Example Outputs

### Valid Diagram
```json
{
  "isValid": true,
  "error": null,
  "diagramType": "flowchart-v2"
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
$ npx mermaid-lint-mcp lint diagram.mmd
📁 Reading file: diagram.mmd
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