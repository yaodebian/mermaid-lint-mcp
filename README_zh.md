# Mermaid Lint MCP

**中文版本** | [English](README.md)

一个强大的 Mermaid 图表验证工具，同时支持命令行和 MCP 服务器功能。专为开发者、技术文档编写者和 AI 助手设计，让 Mermaid 图表验证变得简单高效。

## 🚀 快速开始

### 立即安装使用

```bash
# 验证 Mermaid 文件
npx mermaid-lint-mcp lint diagram.mmd

# 直接验证 Mermaid 代码
npx mermaid-lint-mcp lint --code "graph TD; A-->B"

# 启动 MCP 服务器供 AI 助手使用
npx mermaid-lint-mcp server

# 获取帮助
npx mermaid-lint-mcp --help
```

无需安装！首次使用时会自动下载工具。

## 🎯 使用场景

### 开发者
- **提交前验证**：确保代码库中所有 Mermaid 图表都有效
- **CI/CD 集成**：将图表验证添加到构建流水线
- **文档质量**：发布前捕获语法错误

### 技术文档编写者
- **内容验证**：确保图表在发布前能正确渲染
- **批量处理**：一次验证多个图表文件
- **错误调试**：获得清晰的语法错误信息

### AI 助手
- **实时验证**：即时验证生成的图表
- **MCP 集成**：与 Claude、ChatGPT 等 AI 工具无缝集成
- **自动化工作流**：让 AI 能够自我验证图表输出

## 📋 功能特性

- ✅ **快速验证**：通过浏览器复用和本地库优化速度
- ✅ **多种格式**：支持所有 Mermaid 图表类型
- ✅ **双重接口**：一个包同时提供 CLI 工具和 MCP 服务器
- ✅ **详细错误**：提供行号和建议的清晰错误信息
- ✅ **超时控制**：可配置的验证超时时间
- ✅ **零配置**：开箱即用，默认设置合理

## 🛠️ 安装选项

### 选项 1：使用 npx（推荐）
无需安装 - 直接使用 `npx mermaid-lint-mcp`。

### 选项 2：全局安装
```bash
npm install -g mermaid-lint-mcp
# 然后使用：mermaid-lint-mcp
```

### 选项 3：项目本地安装
```bash
npm install mermaid-lint-mcp
# 然后使用：npx mermaid-lint-mcp
```

## 📖 使用指南

### CLI 命令

#### 验证图表
```bash
# 验证文件
npx mermaid-lint-mcp lint diagram.mmd
npx mermaid-lint-mcp diagram.mmd  # 'lint' 是默认命令

# 验证代码字符串
npx mermaid-lint-mcp lint --code "graph TD; A-->B"

# 自定义超时时间（5秒）
npx mermaid-lint-mcp lint --timeout 5000 diagram.mmd

# 使用文件选项验证
npx mermaid-lint-mcp lint --file diagram.mmd
```

#### 启动 MCP 服务器
```bash
# 启动服务器供 AI 助手集成
npx mermaid-lint-mcp server
```

#### 获取帮助
```bash
npx mermaid-lint-mcp --help     # 显示所有命令
npx mermaid-lint-mcp --version  # 显示版本
```

### MCP 服务器集成

#### Claude Desktop 配置
在 `claude_desktop_config.json` 中添加：

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

#### 其他 MCP 客户端
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

### 编程使用

```typescript
import { MermaidLinter } from 'mermaid-lint-mcp';

const linter = new MermaidLinter();

// 验证图表
const result = await linter.validateDiagram(`
  flowchart TD
    A[开始] --> B{决策}
    B -->|是| C[成功]
    B -->|否| D[重试]
    D --> A
`, { timeout: 10000 });

console.log('有效:', result.isValid);
console.log('类型:', result.diagramType);
if (!result.isValid) {
  console.log('错误:', result.error);
}

// 别忘了清理资源
await linter.cleanup();
```

## 📊 支持的图表类型

| 类型 | 语法 | 示例用途 |
|------|------|----------|
| 流程图 | `flowchart TD` | 决策树、流程 |
| 时序图 | `sequenceDiagram` | API 交互、工作流 |
| 类图 | `classDiagram` | 对象关系 |
| 状态图 | `stateDiagram-v2` | 状态机 |
| ER 图 | `erDiagram` | 数据库模式 |
| 甘特图 | `gantt` | 项目时间线 |
| 饼图 | `pie` | 数据可视化 |
| 用户旅程 | `journey` | 用户体验 |
| Git 图 | `gitgraph` | 版本控制流程 |
| ... | `...` | ... |

## 🔧 配置

### 验证选项
```typescript
interface ValidationOptions {
  timeout?: number;  // 超时时间（毫秒，默认：5000）
}
```

### 环境变量
```bash
# 设置默认超时时间
export MERMAID_TIMEOUT=10000

# 启用调试日志
export DEBUG=mermaid-lint-mcp
```

## 📈 性能

为生产使用优化：

- **首次验证**：约 700ms（包括浏览器启动）
- **后续验证**：每次 10-25ms
- **内存高效**：适当清理防止内存泄漏
- **浏览器复用**：跨验证共享浏览器实例

## 🔍 示例输出

### 有效图表
```json
{
  "isValid": true,
  "error": null,
  "diagramType": "flowchart-v2"
}
```

### 无效图表
```json
{
  "isValid": false,
  "error": "Parse error on line 8: ...> C E --> F[End ---------------------^ Expecting 'SQE', 'DOUBLECIRCLEEND', 'PE', '-)', 'STADIUMEND', 'SUBROUTINEEND', 'PIPE', 'CYLINDEREND', 'DIAMOND_STOP', 'TAGEND', 'TRAPEND', 'INVTRAPEND', 'UNICODE_TEXT', 'TEXT', 'TAGSTART', got '1'",
  "diagramType": "flowchart"
}
```

### CLI 输出
```bash
$ npx mermaid-lint-mcp lint diagram.mmd
📁 读取文件：diagram.mmd
🔍 验证 Mermaid 图表...
✅ 图表有效！
📊 图表类型：flowchart
```

## 🚨 常见问题与解决方案

### 问题："命令未找到"
**解决方案**：使用 `npx mermaid-lint-mcp` 而不是 `mermaid-lint-mcp`

### 问题：验证超时
**解决方案**：使用 `--timeout 10000` 增加超时时间

### 问题：权限被拒绝
**解决方案**：使用适当权限运行或使用 `npx`

## 📝 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙋‍♂️ 支持

- 📖 [文档](https://github.com/yaodebian/mermaid-lint-mcp)
- 🐛 [报告问题](https://github.com/yaodebian/mermaid-lint-mcp/issues)
- 💬 [讨论](https://github.com/yaodebian/mermaid-lint-mcp/discussions)

## 🔗 相关工具

- [Mermaid](https://mermaid.js.org/) - 用文本创建图表
- [Mermaid Live Editor](https://mermaid.live/) - 在线图表编辑器
- [Model Context Protocol](https://modelcontextprotocol.io/) - AI 集成标准