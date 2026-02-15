const appError = require("../utils/appError");

module.exports = (...allowedRoles) => {

  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
        const error = appError.createError("You are not authorized to access this route", 403);
        return next(error);
    }
    next();
  };
};