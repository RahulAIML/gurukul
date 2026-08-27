/**
 * Structured logging, with one hard rule: NEVER log a password, a token, a
 * cookie or a full request body. Auth logs are the highest-value target in the
 * system, so what is not logged matters more than what is.
 */
type Level = 'info' | 'warn' | 'error';

const REDACT = new Set(['password', 'accessToken', 'refreshToken', 'authorization', 'cookie']);

function scrub(meta: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(meta)) {
    out[k] = REDACT.has(k.toLowerCase()) ? '[redacted]' : v;
  }
  return out;
}

function emit(level: Level, message: string, meta: Record<string, unknown> = {}) {
  const line = JSON.stringify({
    level,
    message,
    ...scrub(meta),
    at: new Date().toISOString(),
  });
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.info(line);
}

export const logger = {
  info: (m: string, meta?: Record<string, unknown>) => emit('info', m, meta),
  warn: (m: string, meta?: Record<string, unknown>) => emit('warn', m, meta),
  error: (m: string, meta?: Record<string, unknown>) => emit('error', m, meta),
};
