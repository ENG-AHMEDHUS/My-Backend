const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = appError.createError("token is required", 401);
    return next(error);
  }
  const token = authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (err) {
    const error = appError.createError("Invalid token", 401);
    return next(error);
  }
};
module.exports = verifyToken;
