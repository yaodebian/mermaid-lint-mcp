import { MermaidValidationResult, ValidationOptions } from './types.js';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class MermaidLinter {
  private browser: any = null;
  private page: any = null;
  private initialized = false;
  private browserPath?: string;

  constructor(browserPath?: string) {
    this.browserPath = browserPath;
  }

  private async initializeBrowser(): Promise<void> {
    if (this.initialized) return;

    try {
      // Prepare launch options with optimized settings for testing
      const launchOptions: any = {
        headless: true,
        args: [
          '--no-sandbox',  // Disable Chrome's sandbox for faster startup
          '--disable-setuid-sandbox',  // Disable setuid sandbox to avoid permission issues
          '--disable-dev-shm-usage',  // Use /tmp instead of /dev/shm to avoid memory issues
          '--disable-accelerated-2d-canvas',  // Disable hardware acceleration for 2D canvas
          '--no-first-run',  // Skip first-run setup to speed up initialization
          '--no-zygote',  // Disable zygote process for faster startup in testing
          '--single-process',  // Run Chrome in single process mode for testing
          '--disable-gpu'  // Disable GPU hardware acceleration
        ]
      };

      // Add custom browser path if provided
      if (this.browserPath) {
        launchOptions.executablePath = this.browserPath;
      }

      // Launch headless browser
      this.browser = await puppeteer.launch(launchOptions);
      
      this.page = await this.browser.newPage();
      
      // Use local mermaid instead of CDN for faster loading
      try {
        // Try to find mermaid in node_modules
        const mermaidPath = join(__dirname, '../node_modules/mermaid/dist/mermaid.min.js');
        await this.page.addScriptTag({
          path: mermaidPath
        });
      } catch (error) {
        // Fallback to CDN if local file not found
        await this.page.addScriptTag({
          url: 'https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.min.js'
        });
      }
      
      await this.page.evaluate(() => {
        (window as any).mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'loose',
          theme: 'default'
        });
      });
      
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize browser: ${error}`);
    }
  }

  /**
   * Validate if a Mermaid diagram can be rendered successfully
   */
  async validateDiagram(code: string, options: ValidationOptions = {}): Promise<MermaidValidationResult> {
    const timeout = options.timeout || 5000;
    
    // Update browser path if provided in options
    if (options.browserPath && options.browserPath !== this.browserPath) {
      this.browserPath = options.browserPath;
      // Reset initialization to use new browser path
      this.initialized = false;
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        this.page = null;
      }
    }
    
    // Handle empty code early
    if (!code || code.trim() === '') {
      return {
        isValid: false,
        error: 'Empty diagram code',
      };
    }
    
    try {
      await this.initializeBrowser();
      
      // Set up timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Validation timeout')), timeout);
      });
      
      // Validate the diagram
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
      const result = await this.page.evaluate((diagramCode: string) => {
        return new Promise((resolve) => {
          try { 
            // Get diagram type
            const diagramType = (window as any).mermaid.detectType(diagramCode);
            
            // Create a temporary div for rendering
            const tempDiv = document.createElement('div');
            tempDiv.id = 'mermaid-temp-' + Date.now();
            tempDiv.style.visibility = 'hidden';
            tempDiv.style.position = 'absolute';
            tempDiv.style.top = '-9999px';
            document.body.appendChild(tempDiv);
            
            // Try to actually render the diagram
            (window as any).mermaid.render(tempDiv.id + '-svg', diagramCode)
              .then((result: any) => {
                // Rendering successful
                document.body.removeChild(tempDiv);
                resolve({
                  isValid: true,
                  error: null,
                  diagramType: diagramType || 'unknown'
                });
              })
              .catch((renderError: any) => {
                // Rendering failed - this is where we catch real syntax errors
                document.body.removeChild(tempDiv);
                resolve({
                  isValid: false,
                  error: renderError.message || 'Rendering error',
                  diagramType: diagramType || 'unknown'
                });
              });
              
          } catch (parseError: any) {
            // Parse error - immediate syntax error
            resolve({
              isValid: false,
              error: parseError.message || 'Parse error',
              diagramType: 'unknown'
            });
          }
        });
      }, code);
      
      return result;
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      try {
        // Close all pages first
        const pages = await this.browser.pages();
        await Promise.all(pages.map((page: any) => page.close()));
        
        // Then close the browser
        await this.browser.close();
      } catch (error) {
        // Ignore cleanup errors
        console.warn('Browser cleanup warning:', error);
      } finally {
        this.browser = null;
        this.page = null;
        this.initialized = false;
      }
    }
  }
}