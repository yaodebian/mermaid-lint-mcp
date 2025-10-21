#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { MermaidLinter } from './mermaid-linter.js';

const server = new Server(
  {
    name: 'mermaid-validator-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const linter = new MermaidLinter();

// Tool argument schemas
const ValidateDiagramArgsSchema = z.object({
  code: z.string().describe('Mermaid diagram code to validate'),
  options: z.object({
    timeout: z.number().optional().describe('Validation timeout in milliseconds (default: 5000)'),
  }).optional().describe('Validation options'),
});

// JSON Schema for MCP inputSchema
const ValidateDiagramInputSchema = {
  type: 'object',
  properties: {
    code: {
      type: 'string',
      description: 'Mermaid diagram code to validate'
    },
    options: {
      type: 'object',
      properties: {
        timeout: {
          type: 'number',
          description: 'Validation timeout in milliseconds (default: 5000)'
        }
      },
      additionalProperties: false,
      description: 'Validation options'
    }
  },
  required: ['code'],
  additionalProperties: false
};

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'validate_mermaid_diagram',
        description: 'Validate if a Mermaid diagram can be rendered successfully',
        inputSchema: ValidateDiagramInputSchema,
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'validate_mermaid_diagram': {
        const { code, options } = ValidateDiagramArgsSchema.parse(args);
        const result = await linter.validateDiagram(code, options);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new McpError(ErrorCode.InvalidParams, `Invalid arguments: ${error.message}`);
    }
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(
      ErrorCode.InternalError, 
      `Internal error: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Mermaid Validator MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});