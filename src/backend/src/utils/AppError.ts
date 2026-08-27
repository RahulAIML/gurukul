/**
 * Errors carry a STABLE MACHINE CODE, which is what the client maps to a
 * translated message. The `message` is for logs only and is never sent to a
 * client, so a stack trace or a Mongo error can never leak into a response.
 */
export type ErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_TAKEN'
  | 'WEAK_PASSWORD'
  | 'INVALID_EMAIL'
  | 'SESSION_EXPIRED'
  | 'VALIDATION_FAILED'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'INTERNAL';

const STATUS: Record<ErrorCode, number> = {
  INVALID_CREDENTIALS: 401,
  EMAIL_TAKEN: 409,
  WEAK_PASSWORD: 422,
  INVALID_EMAIL: 422,
  SESSION_EXPIRED: 401,
  VALIDATION_FAILED: 422,
  RATE_LIMITED: 429,
  NOT_FOUND: 404,
  INTERNAL: 500,
};

export class AppError extends Error {
  readonly status: number;

  constructor(
    readonly code: ErrorCode,
    message?: string,
    /** Field-level detail for VALIDATION_FAILED. Field names only — never values. */
    readonly fields?: Record<string, string>,
  ) {
    super(message ?? code);
    this.name = 'AppError';
    this.status = STATUS[code];
  }
}
