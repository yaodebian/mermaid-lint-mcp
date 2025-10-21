import { MermaidLinter } from '../mermaid-linter.js';

describe('MermaidLinter', () => {
  let linter: MermaidLinter;

  beforeAll(async () => {
    linter = new MermaidLinter();
  }); // Increase timeout for browser initialization

  afterAll(async () => {
    await linter.cleanup();
  });

  describe('validateDiagram', () => {
  });

  describe('validateDiagram', () => {
    it('should validate a correct flowchart', async () => {
      const diagramCode = `
        flowchart TD
          A[Start] --> B{Decision}
          B -->|Yes| C[Action 1]
          B -->|No| D[Action 2]
      `;

      const result = await linter.validateDiagram(diagramCode);
      console.log('=====', result)
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.diagramType).toBe('flowchart-v2');
    });

    it('should validate a correct sequence diagram', async () => {
      const diagramCode = `
        sequenceDiagram
          participant A as Alice
          participant B as Bob
          A->>B: Hello Bob, how are you?
          B-->>A: Great!
      `;

      const result = await linter.validateDiagram(diagramCode);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.diagramType).toBe('sequence');
    });

    it('should detect syntax errors', async () => {
      // 使用一个真正会导致解析失败的语法错误
      const diagramCode = `
        flowchart TD
          A[Start] --> 
          --> C[Action 1]
          B -->|No| D[Action 2]
      `;

      const result = await linter.validateDiagram(diagramCode);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
      expect(typeof result.error).toBe('string');
    });

    it('should detect missing closing bracket in decision node', async () => {
      // 测试之前无法检测到的语法错误
      const diagramCode = `
        flowchart TD
          A[Start] --> B{Decision
          B -->|Yes| C[Action 1]
          B -->|No| D[Action 2]
      `;

      const result = await linter.validateDiagram(diagramCode);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
      expect(typeof result.error).toBe('string');
    });

    it('should handle empty diagrams', async () => {
      const diagramCode = '';

      const result = await linter.validateDiagram(diagramCode);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should handle malformed diagrams', async () => {
      const diagramCode = 'this is not a valid mermaid diagram';

      const result = await linter.validateDiagram(diagramCode);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should respect timeout options', async () => {
      const diagramCode = `
        flowchart TD
          A[Start] --> B[End]
      `;

      const result = await linter.validateDiagram(diagramCode, { timeout: 1000 });
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should handle class diagrams', async () => {
      const diagramCode = `
        classDiagram
          class Animal {
            +String name
            +makeSound()
          }
      `;

      const result = await linter.validateDiagram(diagramCode);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.diagramType).toBe('class');
    });

    it('should handle state diagrams', async () => {
      const diagramCode = `
        stateDiagram-v2
          [*] --> Still
          Still --> [*]
          Still --> Moving
          Moving --> Still
      `;

      const result = await linter.validateDiagram(diagramCode);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.diagramType).toBe('stateDiagram');
    });

    it('should handle pie charts', async () => {
      const diagramCode = `
        pie title Pets adopted by volunteers
          "Dogs" : 386
          "Cats" : 85
          "Rats" : 15
      `;

      const result = await linter.validateDiagram(diagramCode);
      
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
      expect(result.diagramType).toBe('pie');
    });
  });
});