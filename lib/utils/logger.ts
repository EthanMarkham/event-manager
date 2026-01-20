/**
 * Simple logging utility for server-side code
 * In production, these logs should be sent to a logging service
 * For now, we'll use console but in a structured way
 */

type LogLevel = "error" | "warn" | "info" | "debug";

interface LogContext {
  [key: string]: unknown;
}

function log(level: LogLevel, message: string, context?: LogContext) {
  // In production, you might want to send these to a logging service
  // For now, we'll use console but only log errors in production
  if (process.env.NODE_ENV === "production" && level !== "error") {
    return; // Only log errors in production
  }

  const logEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  switch (level) {
    case "error":
      console.error(JSON.stringify(logEntry));
      break;
    case "warn":
      console.warn(JSON.stringify(logEntry));
      break;
    case "info":
      console.info(JSON.stringify(logEntry));
      break;
    case "debug":
      console.debug(JSON.stringify(logEntry));
      break;
  }
}

export const logger = {
  error: (message: string, context?: LogContext) => log("error", message, context),
  warn: (message: string, context?: LogContext) => log("warn", message, context),
  info: (message: string, context?: LogContext) => log("info", message, context),
  debug: (message: string, context?: LogContext) => log("debug", message, context),
};
