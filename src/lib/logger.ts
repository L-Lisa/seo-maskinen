// ========================
// Structured Logging System
// ========================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: string | number | boolean | null | undefined | LogContext;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  userId?: string;
  requestId?: string;
  service: string;
}

/**
 * Structured logger for production monitoring
 */
export class Logger {
  private readonly service: string;
  private readonly minLevel: LogLevel;

  constructor(service: string, minLevel: LogLevel = 'info') {
    this.service = service;
    this.minLevel = minLevel;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.minLevel];
  }

  private formatLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      service: this.service,
    };
  }

  private output(entry: LogEntry): void {
    const logString = JSON.stringify(entry);
    
    if (entry.level === 'error') {
      console.error(logString);
    } else if (entry.level === 'warn') {
      console.warn(logString);
    } else {
      console.log(logString);
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      this.output(this.formatLogEntry('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      this.output(this.formatLogEntry('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      this.output(this.formatLogEntry('warn', message, context));
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog('error')) {
      this.output(this.formatLogEntry('error', message, context));
    }
  }

  /**
   * Log with specific user context
   */
  withUser(userId: string) {
    return {
      debug: (message: string, context?: LogContext) => 
        this.debug(message, { ...context, userId }),
      info: (message: string, context?: LogContext) => 
        this.info(message, { ...context, userId }),
      warn: (message: string, context?: LogContext) => 
        this.warn(message, { ...context, userId }),
      error: (message: string, context?: LogContext) => 
        this.error(message, { ...context, userId }),
      withRequest: (requestId: string) => ({
        debug: (message: string, context?: LogContext) => 
          this.debug(message, { ...context, userId, requestId }),
        info: (message: string, context?: LogContext) => 
          this.info(message, { ...context, userId, requestId }),
        warn: (message: string, context?: LogContext) => 
          this.warn(message, { ...context, userId, requestId }),
        error: (message: string, context?: LogContext) => 
          this.error(message, { ...context, userId, requestId }),
      })
    };
  }

  /**
   * Log with request context for tracing
   */
  withRequest(requestId: string) {
    return {
      debug: (message: string, context?: LogContext) => 
        this.debug(message, { ...context, requestId }),
      info: (message: string, context?: LogContext) => 
        this.info(message, { ...context, requestId }),
      warn: (message: string, context?: LogContext) => 
        this.warn(message, { ...context, requestId }),
      error: (message: string, context?: LogContext) => 
        this.error(message, { ...context, requestId }),
      withUser: (userId: string) => ({
        debug: (message: string, context?: LogContext) => 
          this.debug(message, { ...context, requestId, userId }),
        info: (message: string, context?: LogContext) => 
          this.info(message, { ...context, requestId, userId }),
        warn: (message: string, context?: LogContext) => 
          this.warn(message, { ...context, requestId, userId }),
        error: (message: string, context?: LogContext) => 
          this.error(message, { ...context, requestId, userId }),
      })
    };
  }
}

// ========================
// Service-specific loggers
// ========================

export const apiLogger = new Logger('api', process.env.NODE_ENV === 'development' ? 'debug' : 'info');
export const crawlerLogger = new Logger('crawler', 'info');
export const openaiLogger = new Logger('openai', 'info');
export const authLogger = new Logger('auth', 'info');
export const dbLogger = new Logger('database', 'warn'); // Only log warnings/errors for DB

// ========================
// Request tracking
// ========================

let requestCounter = 0;

export function generateRequestId(): string {
  requestCounter = (requestCounter + 1) % 1000000;
  return `req_${Date.now()}_${requestCounter.toString().padStart(6, '0')}`;
}

// ========================
// Performance monitoring
// ========================

export interface PerformanceMetrics {
  requestId: string;
  operation: string;
  duration: number;
  success: boolean;
  userId?: string;
  metadata?: LogContext;
}

export class PerformanceTracker {
  private readonly startTime: number;
  private readonly requestId: string;
  private readonly operation: string;
  private readonly logger: Logger;

  constructor(operation: string, requestId: string, logger: Logger) {
    this.startTime = Date.now();
    this.requestId = requestId;
    this.operation = operation;
    this.logger = logger;
  }

  /**
   * Mark operation as completed successfully
   */
  success(metadata?: LogContext): void {
    const duration = Date.now() - this.startTime;
    this.logger.info(`Operation completed: ${this.operation}`, {
      requestId: this.requestId,
      duration,
      success: true,
      ...metadata,
    });
  }

  /**
   * Mark operation as failed
   */
  failure(error: string, metadata?: LogContext): void {
    const duration = Date.now() - this.startTime;
    this.logger.error(`Operation failed: ${this.operation}`, {
      requestId: this.requestId,
      duration,
      success: false,
      error,
      ...metadata,
    });
  }

  /**
   * Get current duration
   */
  getCurrentDuration(): number {
    return Date.now() - this.startTime;
  }
}

// ========================
// Utility functions
// ========================

/**
 * Sanitize sensitive data from logs
 */
export function sanitizeForLogs(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sensitiveKeys = ['password', 'token', 'key', 'secret', 'authorization'];
  const sanitized = { ...obj } as Record<string, unknown>;
  
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
      sanitized[key] = sanitizeForLogs(sanitized[key]);
    }
  }
  
  return sanitized;
}

/**
 * Log HTTP request details safely
 */
export function logHttpRequest(request: Request, context?: LogContext): void {
  const sanitizedHeaders = sanitizeForLogs(Object.fromEntries(request.headers.entries())) as LogContext;
  
  apiLogger.info('HTTP Request', {
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent') || undefined,
    headers: sanitizedHeaders,
    ...context,
  });
}

/**
 * Log HTTP response details
 */
export function logHttpResponse(status: number, duration: number, context?: LogContext): void {
  apiLogger.info('HTTP Response', {
    status,
    duration,
    ...context,
  });
}
