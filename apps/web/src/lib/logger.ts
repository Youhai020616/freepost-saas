/**
 * Structured logging utility for Freepost SaaS
 *
 * Replaces console.log with structured, leveled logging that's
 * production-ready and integrates with observability tools.
 *
 * Usage:
 *   logger.info('User created', { userId: '123', email: 'user@example.com' });
 *   logger.error('Failed to publish post', { error, postId });
 *   logger.warn('Rate limit approaching', { usage: 95, limit: 100 });
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

class Logger {
  private isDevelopment: boolean;
  private minLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.minLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatLog(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Human-readable format for development
      const contextStr = entry.context ? ` ${JSON.stringify(entry.context, null, 2)}` : '';
      return `[${entry.level.toUpperCase()}] ${entry.message}${contextStr}`;
    }
    // JSON format for production (structured logging)
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    const formatted = this.formatLog(entry);

    // Route to appropriate console method
    switch (level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }

    // In production, you could also send to external logging service
    // e.g., Datadog, Sentry, CloudWatch, etc.
    if (!this.isDevelopment && level === 'error') {
      // TODO: Send to error tracking service (Sentry, etc.)
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  /**
   * Log with automatic error extraction
   */
  logError(message: string, error: unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : String(error),
    };
    this.error(message, errorContext);
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Migration helper: Drop-in replacement for console.log
 *
 * Before: console.log('User action', data);
 * After:  logInfo('User action', data);
 */
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, errorOrContext?: unknown) => {
  if (errorOrContext instanceof Error) {
    logger.logError(message, errorOrContext);
  } else {
    logger.error(message, errorOrContext as LogContext);
  }
};
