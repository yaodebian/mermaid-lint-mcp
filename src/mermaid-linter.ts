import { MermaidValidationResult, ValidationOptions } from './types.js';
import mermaid from 'mermaid';

export class MermaidLinter {
  private initialized = false;

  constructor() {}

  private async initializeMermaid(): Promise<void> {
    if (this.initialized) return;

    try {
      // 初始化 Mermaid（关闭浏览器相关功能）
      mermaid.initialize({
        startOnLoad: false,
        logLevel: 'error',
        securityLevel: 'loose',
        theme: 'default'
      });
      
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize mermaid: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Validate if a Mermaid diagram syntax is correct
   */
  async validateDiagram(code: string, options: ValidationOptions = {}): Promise<MermaidValidationResult> {
    // Handle empty code early
    if (!code || code.trim() === '') {
      return {
        isValid: false,
        error: 'Empty diagram code',
      };
    }
    
    try {
      await this.initializeMermaid();
      
      // 设置超时处理
      const timeout = options.timeout || 5000;
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Validation timeout')), timeout);
      });
      
      // 执行验证
      const validationPromise = this.performValidation(code);
      
      return await Promise.race([validationPromise, timeoutPromise]);
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private async performValidation(code: string): Promise<MermaidValidationResult> {
    try {
      // 方法1：快速类型检测
      let diagramType: string;
      try {
        diagramType = mermaid.detectType(code);
      } catch (error) {
        return {
          isValid: false,
          error: `Failed to detect diagram type: ${error instanceof Error ? error.message : String(error)}`,
        };
      }

      // 方法2：完整语法解析
      try {
        const result = await mermaid.parse(code, { suppressErrors: false });
        
        return {
          isValid: true,
          error: null,
          diagramType: diagramType || 'unknown'
        };
      } catch (parseError) {
        // 如果解析失败，返回详细的错误信息
        const errorMessage = parseError instanceof Error ? parseError.message : String(parseError);
        
        return {
          isValid: false,
          error: `Syntax error: ${errorMessage}`,
          diagramType: diagramType || 'unknown'
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Get the type of a Mermaid diagram
   */
  async getDiagramType(code: string): Promise<string> {
    try {
      await this.initializeMermaid();
      return mermaid.detectType(code);
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Clean up resources (now just a placeholder since we don't use browser)
   */
  async cleanup(): Promise<void> {
    // No cleanup needed for native Mermaid API
    this.initialized = false;
  }
}