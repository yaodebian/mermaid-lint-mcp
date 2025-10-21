# Mermaid Lint MCP

**中文版本** | [English](README.md)

一个模型上下文协议 (MCP) 服务器，专门用于验证 Mermaid 图表是否能够正常渲染。这个工具帮助大型语言模型 (LLM) 快速验证 Mermaid 图表的语法正确性。

## 功能特性

- **渲染验证**: 检测 Mermaid 图表是否能够正常渲染
- **多种图表类型**: 支持流程图、时序图、类图、状态图、饼图等
- **简单易用**: 提供简洁的验证结果，包含是否有效和错误信息
- **超时控制**: 支持设置验证超时时间，避免长时间等待
- **MCP 集成**: 与兼容 MCP 的 AI 助手和工具无缝集成
- **高性能**: 通过本地 Mermaid 库和浏览器复用优化，实现快速验证

## 支持的图表类型

- 流程图 (`flowchart`, `graph`)
- 时序图 (`sequenceDiagram`)
- 类图 (`classDiagram`)
- 状态图 (`stateDiagram`)
- 饼图 (`pie`)
- 甘特图 (`gantt`)
- 用户旅程图 (`journey`)
- Git 图 (`gitgraph`)
- 实体关系图 (`erDiagram`)
- 以及更多...

## 安装

### 前置要求

- Node.js 18 或更高版本
- npm 或 pnpm

### 从 npm 安装

```bash
npm install -g mermaid-lint-mcp
```

### 从源码构建

```bash
git clone https://github.com/dongmu/mermaid-lint-mcp.git
cd mermaid-lint-mcp
pnpm install
pnpm run build
```

## 使用方法

### 作为 MCP 服务器

主要用途是作为 MCP 服务器，可以与 AI 助手和其他 MCP 客户端集成。

#### 配置

将服务器添加到您的 MCP 客户端配置中：

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

#### 可用工具

1. **`validate_mermaid_diagram`** - 验证 Mermaid 图表
   - 参数: `code` (字符串), `timeout` (数字，可选)
   - 返回: 验证结果，包含是否有效和错误信息

### 编程方式使用

```typescript
import { MermaidLinter } from 'mermaid-lint-mcp';

const linter = new MermaidLinter();

// 验证图表
const result = await linter.validateDiagram(`
  flowchart TD
    A[开始] --> B{决策}
    B -->|是| C[结束]
    B -->|否| A
`);

console.log(result.isValid);
console.log(result.error);
console.log(result.diagramType);
```

## 验证选项

验证函数接受各种选项来自定义验证：

```typescript
interface ValidationOptions {
  timeout?: number;  // 验证超时时间（毫秒，默认：5000）
}
```

## 示例输出

```json
{
  "isValid": true,
  "error": null,
  "diagramType": "flowchart-v2"
}
```

对于无效图表：

```json
{
  "isValid": false,
  "error": "Parse error on line 2: Unexpected token",
  "diagramType": null
}
```

## 性能优化

此工具包含多项性能优化，实现快速验证：

- **优化的 Puppeteer 配置**: 使用无头 Chrome 和性能优化的启动参数
- **本地 Mermaid 库**: 从本地 node_modules 加载 Mermaid 而非 CDN，加载更快
- **浏览器复用**: 在多次验证中复用浏览器实例，避免启动开销
- **正确清理**: 确保所有浏览器资源被正确清理，防止内存泄漏

典型性能表现：
- 首次验证：约 700ms（包含浏览器启动）
- 后续验证：每次 10-25ms

## 开发

### 设置开发环境

```bash
git clone https://github.com/dongmu/mermaid-lint-mcp.git
cd mermaid-lint-mcp
pnpm install
```

### 构建项目

```bash
pnpm run build
```

### 运行测试

```bash
pnpm test
```

### 开发模式

```bash
pnpm run dev
```

## 贡献

欢迎贡献！请阅读我们的贡献指南：

1. Fork 这个仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 更新日志

### v1.0.0
- 初始版本
- 基本的 Mermaid 图表渲染验证
- 支持多种图表类型
- MCP 服务器集成
- 超时控制
- 性能优化

## 支持

如果您遇到任何问题或有疑问，请：

1. 查看 [Issues](https://github.com/yaodebian/mermaid-lint-mcp/issues) 页面
2. 创建新的 issue 描述您的问题
3. 提供尽可能详细的信息，包括错误消息和示例代码

## 相关项目

- [Mermaid](https://mermaid.js.org/) - 官方 Mermaid 库
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP 规范