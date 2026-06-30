import * as Sentry from '@sentry/nextjs';

export type LogLevel = 'error' | 'warning' | 'info' | 'debug';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  error(message: string, context?: LogContext) {
    console.error(`[ERROR] ${message}`, context);
    
    // Send to Sentry in production
    if (!this.isDevelopment && process.env.SENTRY_DSN) {
      Sentry.captureException(new Error(message), { 
        level: 'error',
        extra: context,
        tags: { type: 'error' },
      });
    }
  }

  warning(message: string, context?: LogContext) {
    console.warn(`[WARN] ${message}`, context);
    
    if (!this.isDevelopment && process.env.SENTRY_DSN) {
      Sentry.captureMessage(message, {
        level: 'warning',
        extra: context,
        tags: { type: 'warning' },
      });
    }
  }

  info(message: string, context?: LogContext) {
    console.info(`[INFO] ${message}`, context);
  }

  debug(message: string, context?: LogContext) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context);
    }
  }

  /**
   * Log API request
   */
  logAPIRequest(method: string, path: string, status: number, duration: number) {
    const message = `${method} ${path} - ${status} (${duration}ms)`;
    if (status >= 400) {
      this.warning(message);
    } else {
      this.info(message);
    }
  }

  /**
   * Log database operation
   */
  logDatabaseOperation(operation: string, table: string, duration: number) {
    this.debug(`DB ${operation} on ${table}`, { duration });
  }

  /**
   * Log authentication event
   */
  logAuthEvent(event: 'login' | 'logout' | 'failed_login' | 'session_created', email: string, context?: LogContext) {
    this.info(`Auth event: ${event}`, { email, ...context });
  }

  /**
   * Log rate limit hit
   */
  logRateLimitHit(identifier: string, limit: string) {
    this.warning(`Rate limit exceeded for ${identifier}: ${limit}`);
  }
}

export const logger = new Logger();
