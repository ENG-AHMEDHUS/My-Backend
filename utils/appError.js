class AppError extends Error {
  constructor() {
    super();
  }
  createError(message, status) {
    this.message = message;
    this.status = status;
    return this;
  }
}
module.exports = new AppError();
