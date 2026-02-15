const User = require("../models/users_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const httpStatusText = require("../utils/httpstatustext");
const asyncwrapper = require("../middleware/asyncwrapper");
const appError = require("../utils/appError");
const genrateJWT = require("../utils/genrateJWT");

const getAllUsers = asyncwrapper(async (req, res) => {
  const limit = req.query.limit || 20;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  const users = await User.find({}, { __v: false, password: false })
    .skip(skip)
    .limit(limit);

  res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncwrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  if (!firstName || !lastName || !email || !password) {
    const error = appError.createError("All fields are required", 400);
    return next(error);
  }

  const user = await User.findOne({ email });
  if (user) {
    const error = appError.createError("Email already exists", 400);
    return next(error);
  }
  // Hash the password before saving the user
  const saltRounds = 11;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  // Generate a JWT token for the user
  const token = await genrateJWT({
    id: newUser._id,
    email: newUser.email,
    role: newUser.role,
  });
  newUser.token = token;

  await newUser.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { user: newUser } });
});

const login = asyncwrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const error = appError.createError("All fields are required", 400);
    return next(error);
  }
  const user = await User.findOne({ email });
  if (!user) {
    const error = appError.createError("Invalid email or password", 401);
    return next(error);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const error = appError.createError("Invalid email or password", 401);
    return next(error);
  }
  // Generate a JWT token for the user
  const token = await genrateJWT({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  res.json({ status: httpStatusText.SUCCESS, data: { token } });
});

module.exports = {
  getAllUsers,
  register,
  login,
};
