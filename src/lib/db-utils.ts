import { logger } from "./logger";

const transientDbErrorCodes = new Set([
  "40001", // serialization_failure
  "40P01", // deadlock_detected
  "53300", // too_many_connections
  "57P03", // cannot_connect_now
  "08003", // connection_does_not_exist
  "08006", // connection_failure
  "08001", // sqlclient_unable_to_establish_sqlconnection
]);

function isTransientDbError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const err = error as { code?: string; message?: string };
  const code = typeof err.code === "string" ? err.code : undefined;
  const message = typeof err.message === "string" ? err.message.toLowerCase() : "";

  if (code && transientDbErrorCodes.has(code)) {
    return true;
  }

  return /deadlock|serialize|timeout|connection|too many clients|could not connect|temporarily unavailable/.test(message);
}

export async function runDbOperation<T>(operation: () => Promise<T>, retries = 2, backoffMs = 200): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt === retries || !isTransientDbError(error)) {
        break;
      }

      const delay = backoffMs * Math.pow(2, attempt);
      logger.warning("Transient database error detected. Retrying operation.", {
        attempt: attempt + 1,
        delayMs: delay,
        error,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
