/**
 * @extends Error
 */
class APIError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

export default APIError;
