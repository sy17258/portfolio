/**
 * Security utilities for the portfolio application
 * Provides input sanitization, validation, and security helpers
 */

export class SecurityUtils {
  /**
   * Sanitize user input to prevent XSS and injection attacks
   */
  static sanitizeInput(input: string, maxLength: number = 500): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }

    return input
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
      .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:text\/html/gi, '') // Remove data URLs that could contain HTML
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
      .substring(0, maxLength);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Check if a string contains potentially harmful content
   */
  static containsSuspiciousContent(input: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /data:text\/html/i,
      /\beval\s*\(/i,
      /\bFunction\s*\(/i,
      /\bsetTimeout\s*\(/i,
      /\bsetInterval\s*\(/i,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Generate a secure session ID
   */
  static generateSessionId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Fallback for environments without crypto.randomUUID
    return Math.random().toString(36).substring(2) + 
           Date.now().toString(36) + 
           Math.random().toString(36).substring(2);
  }

  /**
   * Rate limit key generator with IP address masking for privacy
   */
  static generateRateLimitKey(ip: string): string {
    if (!ip || ip === 'unknown') {
      return 'anonymous';
    }

    // For IPv4, mask the last octet for privacy
    if (ip.includes('.')) {
      const parts = ip.split('.');
      if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
      }
    }

    // For IPv6, mask the last segment
    if (ip.includes(':')) {
      const parts = ip.split(':');
      if (parts.length > 1) {
        return parts.slice(0, -1).join(':') + ':xxxx';
      }
    }

    return 'masked';
  }

  /**
   * Validate conversation history structure
   */
  static validateConversationHistory(history: any[]): boolean {
    if (!Array.isArray(history)) {
      return false;
    }

    return history.every(msg => 
      msg &&
      typeof msg === 'object' &&
      typeof msg.content === 'string' &&
      ['user', 'assistant'].includes(msg.type) &&
      msg.content.length <= 2000
    );
  }

  /**
   * Content Security Policy nonce generator
   */
  static generateCSPNonce(): string {
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Validate API request origin (for CORS protection)
   */
  static isValidOrigin(origin: string, allowedOrigins: string[]): boolean {
    if (!origin) return false;
    
    try {
      const url = new URL(origin);
      return allowedOrigins.some(allowed => {
        if (allowed === '*') return true;
        if (allowed.startsWith('*.')) {
          const domain = allowed.substring(2);
          return url.hostname.endsWith(domain);
        }
        return url.origin === allowed;
      });
    } catch {
      return false;
    }
  }

  /**
   * Log security events (for monitoring)
   */
  static logSecurityEvent(event: {
    type: 'rate_limit' | 'invalid_input' | 'suspicious_content' | 'api_error';
    ip: string;
    userAgent?: string;
    details?: any;
  }): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: event.type,
      ip: this.generateRateLimitKey(event.ip), // Masked IP for privacy
      userAgent: event.userAgent ? event.userAgent.substring(0, 200) : undefined,
      details: event.details,
    };

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with monitoring service (DataDog, Sentry, etc.)
      console.error('Security Event:', JSON.stringify(logEntry));
    } else {
      console.warn('Security Event:', logEntry);
    }
  }
}

/**
 * Security middleware for API routes
 */
export function createSecurityMiddleware(options: {
  maxRequestSize?: number;
  allowedOrigins?: string[];
  requireHttps?: boolean;
} = {}) {
  const {
    maxRequestSize = 1024 * 10, // 10KB default
    allowedOrigins = [],
    requireHttps = process.env.NODE_ENV === 'production'
  } = options;

  return async function securityMiddleware(request: Request) {
    const url = new URL(request.url);
    const origin = request.headers.get('origin');
    const contentLength = request.headers.get('content-length');

    // HTTPS enforcement in production
    if (requireHttps && url.protocol !== 'https:') {
      return new Response('HTTPS required', { status: 403 });
    }

    // Content length check
    if (contentLength && parseInt(contentLength) > maxRequestSize) {
      return new Response('Request too large', { status: 413 });
    }

    // Origin validation for CORS
    if (allowedOrigins.length > 0 && origin) {
      if (!SecurityUtils.isValidOrigin(origin, allowedOrigins)) {
        return new Response('Invalid origin', { status: 403 });
      }
    }

    return null; // Allow request to proceed
  };
}

export default SecurityUtils;
