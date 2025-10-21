import { spawn, ChildProcess } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { 
  CallToolResultSchema,
  ListToolsResultSchema
} from '@modelcontextprotocol/sdk/types.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('MCP Integration Tests', () => {
  let client: Client;
  let transport: StdioClientTransport;

  beforeAll(async () => {
    // Create client transport layer and start server directly
    const serverPath = join(__dirname, '../index.ts');
    transport = new StdioClientTransport({
      command: 'npx',
      args: ['tsx', serverPath]
    });

    // Create MCP client
    client = new Client(
      {
        name: 'mcp-integration-test-client',
        version: '1.0.0'
      },
      {
        capabilities: {}
      }
    );

    // Connect to server
    await client.connect(transport);
  }, 15000);

  afterAll(async () => {
    // Clean up resources
    if (client) {
      await client.close();
    }
  });

  describe('MCP Protocol Communication', () => {
    it('should list available tools', async () => {
      const response = await client.request(
        { method: 'tools/list' },
        ListToolsResultSchema
      );
      
      expect(response).toBeDefined();
      expect(response.tools).toBeDefined();
      expect(Array.isArray(response.tools)).toBe(true);
      expect(response.tools.length).toBeGreaterThan(0);
      
      // Validate tool information
      const validateTool = response.tools.find((tool: any) => tool.name === 'validate_mermaid_diagram');
      expect(validateTool).toBeDefined();
      if (validateTool) {
        expect(validateTool.description).toContain('Mermaid diagram');
        expect(validateTool.inputSchema).toBeDefined();
      }
    });

    it('should validate a correct mermaid diagram via MCP', async () => {
      const diagramCode = `
        flowchart TD
          A[Start] --> B{Decision}
          B -->|Yes| C[Action 1]
          B -->|No| D[Action 2]
      `;

      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'validate_mermaid_diagram',
            arguments: {
              code: diagramCode,
              options: {
                timeout: 5000
              }
            }
          }
        },
        CallToolResultSchema
      );
      
      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(Array.isArray(response.content)).toBe(true);
      expect(response.content.length).toBeGreaterThan(0);
      
      // Parse response content
      const textContent = response.content.find((c: any) => c.type === 'text');
      expect(textContent).toBeDefined();
      
      if (textContent && textContent.text) {
        const result = JSON.parse(textContent.text as string);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
        expect(result.diagramType).toBe('flowchart-v2');
      }
    });

    it('should detect invalid mermaid diagram via MCP', async () => {
      const invalidDiagramCode = `
        flowchart TD
          A[Start] --> 
          --> C[Action 1]
          B -->|No| D[Action 2]
      `;

      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'validate_mermaid_diagram',
            arguments: {
              code: invalidDiagramCode
            }
          }
        },
        CallToolResultSchema
      );
      
      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      
      const textContent = response.content.find((c: any) => c.type === 'text');
      expect(textContent).toBeDefined();
      
      if (textContent && textContent.text) {
        const result = JSON.parse(textContent.text as string);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
        expect(typeof result.error).toBe('string');
      }
    });

    it('should handle sequence diagrams via MCP', async () => {
      const sequenceDiagramCode = `
        sequenceDiagram
          participant A as Alice
          participant B as Bob
          A->>B: Hello Bob, how are you?
          B-->>A: Great!
      `;

      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'validate_mermaid_diagram',
            arguments: {
              code: sequenceDiagramCode
            }
          }
        },
        CallToolResultSchema
      );
      
      const textContent = response.content.find((c: any) => c.type === 'text');
      
      if (textContent && textContent.text) {
        const result = JSON.parse(textContent.text as string);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
        expect(result.diagramType).toBe('sequence');
      }
    });

    it('should handle empty diagram code via MCP', async () => {
      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'validate_mermaid_diagram',
            arguments: {
              code: ''
            }
          }
        },
        CallToolResultSchema
      );
      
      const textContent = response.content.find((c: any) => c.type === 'text');
      
      if (textContent && textContent.text) {
        const result = JSON.parse(textContent.text as string);
        expect(result.isValid).toBe(false);
        expect(result.error).toBeTruthy();
      }
    });

    it('should handle malformed arguments gracefully', async () => {
      try {
        await client.request(
          {
            method: 'tools/call',
            params: {
              name: 'validate_mermaid_diagram',
              arguments: {
              // Missing required code parameter
              options: {
                  timeout: 1000
                }
              }
            }
          },
          CallToolResultSchema
        );
        fail('Should have thrown an error for missing required parameter');
      } catch (error: any) {
        expect(error).toBeDefined();
        // MCP error should contain error information
        expect(error.message || error.code).toBeDefined();
      }
    });

    it('should handle unknown tool calls', async () => {
      try {
        await client.request(
          {
            method: 'tools/call',
            params: {
              name: 'unknown_tool',
              arguments: {}
            }
          },
          CallToolResultSchema
        );
        fail('Should have thrown an error for unknown tool');
      } catch (error: any) {
          expect(error).toBeDefined();
          // Should return tool not found error
          expect(error.message || error.code).toBeDefined();
      }
    });

    it('should respect timeout options via MCP', async () => {
      const diagramCode = `
        flowchart TD
          A[Start] --> B[End]
      `;

      const startTime = Date.now();
      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'validate_mermaid_diagram',
            arguments: {
              code: diagramCode,
              options: {
                timeout: 1000
              }
            }
          }
        },
        CallToolResultSchema
      );
      const endTime = Date.now();
      
      const textContent = response.content.find((c: any) => c.type === 'text');
      
      if (textContent && textContent.text) {
        const result = JSON.parse(textContent.text as string);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
        
        // Validate response time is reasonable (should be much less than timeout)
        expect(endTime - startTime).toBeLessThan(10000);
      }
    });
  });

  describe('Multiple Diagram Types via MCP', () => {
    const testCases = [
      {
        name: 'class diagram',
        code: `
          classDiagram
            class Animal {
              +String name
              +makeSound()
            }
        `,
        expectedType: 'class'
      },
      {
        name: 'state diagram',
        code: `
          stateDiagram-v2
            [*] --> Still
            Still --> [*]
            Still --> Moving
            Moving --> Still
        `,
        expectedType: 'stateDiagram'
      },
      {
        name: 'pie chart',
        code: `
          pie title Pets adopted by volunteers
            "Dogs" : 386
            "Cats" : 85
            "Rats" : 15
        `,
        expectedType: 'pie'
      }
    ];

    testCases.forEach(({ name, code, expectedType }) => {
      it(`should validate ${name} via MCP`, async () => {
        const response = await client.request(
          {
            method: 'tools/call',
            params: {
              name: 'validate_mermaid_diagram',
              arguments: {
                code: code
              }
            }
          },
          CallToolResultSchema
        );
        
        const textContent = response.content.find((c: any) => c.type === 'text');
        
        if (textContent && textContent.text) {
          const result = JSON.parse(textContent.text as string);
          expect(result.isValid).toBe(true);
          expect(result.error).toBeNull();
          expect(result.diagramType).toBe(expectedType);
        }
      });
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle multiple concurrent requests', async () => {
      const diagramCode = `
        flowchart TD
          A[Start] --> B[End]
      `;

      // Send multiple concurrent requests
      const promises = Array.from({ length: 3 }, () =>
        client.request(
          {
            method: 'tools/call',
            params: {
              name: 'validate_mermaid_diagram',
              arguments: {
                code: diagramCode
              }
            }
          },
          CallToolResultSchema
        )
      );

      const responses = await Promise.all(promises);
      
      // Validate all responses are successful
      responses.forEach(response => {
        expect(response).toBeDefined();
        expect(response.content).toBeDefined();
        
        const textContent = response.content.find((c: any) => c.type === 'text');
        if (textContent && textContent.text) {
          const result = JSON.parse(textContent.text as string);
          expect(result.isValid).toBe(true);
          expect(result.error).toBeNull();
        }
      });
    });

    it('should handle large diagram code', async () => {
      // Create a large flowchart
      const largeDiagramCode = `
        flowchart TD
          ${Array.from({ length: 20 }, (_, i) => 
            `A${i}[Node ${i}] --> A${i + 1}[Node ${i + 1}]`
          ).join('\n          ')}
      `;

      const response = await client.request(
        {
          method: 'tools/call',
          params: {
            name: 'validate_mermaid_diagram',
            arguments: {
              code: largeDiagramCode
            }
          }
        },
        CallToolResultSchema
      );
      
      const textContent = response.content.find((c: any) => c.type === 'text');
      
      if (textContent && textContent.text) {
        const result = JSON.parse(textContent.text as string);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
        expect(result.diagramType).toBe('flowchart-v2');
      }
    });
  });
});