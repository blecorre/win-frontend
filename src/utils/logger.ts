/* eslint-disable no-console */
import { APP_LOG_LEVEL } from 'src/config';

export interface LoggerApi {
  error: (...message: unknown[]) => void;
  debug: (...message: unknown[]) => void;
  info: (...message: unknown[]) => void;
}

// Possible log level types
const logLevels: Record<string, number> = {
  none: 0,
  error: 1,
  debug: 2,
  info: 3
};

// Getting log level from the ENV
const logLevel = logLevels[APP_LOG_LEVEL] || 0;

// Default logging function
const logFunction = (subject: string, args: unknown[]) =>
  // eslint-disable-next-line no-console
  console.log(...[`${subject}:`, ...args]);

// Creates logger
const Logger = (subject: string): LoggerApi => ({
  error: (...args) => {
    if (logLevel >= 1) {
      logFunction(subject, args);
    }
  },
  debug: (...args) => {
    if (logLevel >= 2) {
      logFunction(subject, args);
    }
  },
  info: (...args) => {
    if (logLevel >= 3) {
      logFunction(subject, args);
    }
  }
});

export default Logger;
