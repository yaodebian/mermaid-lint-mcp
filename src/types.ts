/**
 * Result of Mermaid diagram validation
 * Contains only basic validation status and error information
 */
export interface MermaidValidationResult {
  /** Whether the diagram can be rendered successfully */
  isValid: boolean;
  
  /** Error message if validation fails (null if valid) */
  error: string | null;
  
  /** Type of Mermaid diagram if successfully parsed */
  diagramType?: string;
}

/**
 * Simple options for Mermaid validation
 */
export interface ValidationOptions {
  /** Timeout for validation in milliseconds (default: 5000) */
  timeout?: number;
  /** Path to custom browser executable for puppeteer */
  browserPath?: string;
}