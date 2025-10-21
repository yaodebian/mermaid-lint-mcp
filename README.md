# Mermaid Lint MCP

[中文版本](README_zh.md) | **English**

A Model Context Protocol (MCP) server for validating Mermaid diagrams. This tool helps Large Language Models (LLMs) quickly validate the syntax correctness of Mermaid diagrams by checking if they can be properly rendered.

## Features

- **Rendering Validation**: Detects whether Mermaid diagrams can be properly rendered
- **Multiple Diagram Types**: Supports flowcharts, sequence diagrams, class diagrams, state diagrams, pie charts, and more
- **Simple to Use**: Provides clean validation results with validity status and error information
- **Timeout Control**: Supports setting validation timeout to avoid long waits
- **MCP Integration**: Seamlessly integrates with MCP-compatible AI assistants and tools
- **Fast Performance**: Optimized for quick validation with local Mermaid library and browser reuse

## Supported Diagram Types

- Flowcharts (`flowchart`, `graph`)
- Sequence Diagrams (`sequenceDiagram`)
- Class Diagrams (`classDiagram`)
- State Diagrams (`stateDiagram`)
- Pie Charts (`pie`)
- Gantt Charts (`gantt`)
- User Journey (`journey`)
- Git Graphs (`gitgraph`)
- Entity Relationship Diagrams (`erDiagram`)
- And more...

## Installation

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Install from npm

```bash
npm install -g mermaid-lint-mcp
```

### Build from Source

```bash
git clone https://github.com/dongmu/mermaid-lint-mcp.git
cd mermaid-lint-mcp
pnpm install
pnpm run build
```

## Usage

### As MCP Server

The primary use case is as an MCP server that can be integrated with AI assistants and other MCP clients.

#### Configuration

Add the server to your MCP client configuration:

```json
{
  "mcpServers": {
    "mermaid-lint": {
      "command": "node",
      "args": ["/path/to/mermaid-lint-mcp/dist/index.js"],
      "env": {}
    }
  }
}
```

#### Available Tools

1. **`validate_mermaid_diagram`** - Validate Mermaid diagrams
   - Parameters: `code` (string), `timeout` (number, optional)
   - Returns: Validation result with validity status and error information

### Programmatic Usage

```typescript
import { MermaidLinter } from 'mermaid-lint-mcp';

const linter = new MermaidLinter();

// Validate a diagram
const result = await linter.validateDiagram(`
  flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[End]
    B -->|No| A
`);

console.log(result.isValid);
console.log(result.error);
console.log(result.diagramType);
```

## Validation Options

The validation function accepts various options to customize validation:

```typescript
interface ValidationOptions {
  timeout?: number;  // Validation timeout in milliseconds (default: 5000)
}
```

## Example Output

```json
{
  "isValid": true,
  "error": null,
  "diagramType": "flowchart-v2"
}
```

For invalid diagrams:

```json
{
  "isValid": false,
  "error": "Parse error on line 2: Unexpected token",
  "diagramType": null
}
```

## Performance Optimizations

This tool includes several performance optimizations for fast validation:

- **Optimized Puppeteer Configuration**: Uses headless Chrome with performance-focused launch arguments
- **Local Mermaid Library**: Loads Mermaid from local node_modules instead of CDN for faster loading
- **Browser Reuse**: Reuses browser instances across multiple validations to avoid startup overhead
- **Proper Cleanup**: Ensures all browser resources are properly cleaned up to prevent memory leaks

Typical performance:
- First validation: ~700ms (includes browser startup)
- Subsequent validations: ~10-25ms each

## Development

### Setup Development Environment

```bash
git clone https://github.com/dongmu/mermaid-lint-mcp.git
cd mermaid-lint-mcp
pnpm install
```

### Build Project

```bash
pnpm run build
```

### Run Tests

```bash
pnpm test
```

### Development Mode

```bash
pnpm run dev
```

## Contributing

Contributions are welcome! Please read our contributing guidelines:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### v1.0.0
- Initial release
- Basic Mermaid diagram rendering validation
- Support for multiple diagram types
- MCP server integration
- Timeout control
- Performance optimizations

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yaodebian/mermaid-lint-mcp/issues) page
2. Create a new issue describing your problem
3. Provide as much detail as possible, including error messages and example code

## Related Projects

- [Mermaid](https://mermaid.js.org/) - Official Mermaid library
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification