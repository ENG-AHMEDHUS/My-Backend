const Course = require("../models/courses_model");

const { validationResult } = require("express-validator");

const httpStatusText = require("../utils/httpstatustext");
const asyncwrapper = require("../middleware/asyncwrapper");
const appError = require("../utils/appError");

const get_all_courses = asyncwrapper(async (req, res) => {
  const limit = req.query.limit || 5;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  res.json({
    status: httpStatusText.SUCCESS,
    data: { courses },
  });
});

const get_single_course = asyncwrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId, { __v: false });
  if (!course) {
    const error = appError.createError("Course Not Found", 404);
    return next(error);
  }

  return res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const create_course = asyncwrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.createError(errors.array(), 400);
    return next(error);
  }

  const newCourse = new Course(req.body);
  await newCourse.save();

  res
    .status(201)
    .json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
});

const update_course = asyncwrapper(async (req, res, next) => {
  const courseId = req.params.courseId;

  const course = await Course.findByIdAndUpdate(
    courseId,
    { $set: { ...req.body } },
    { new: true },
  );
  if (!course)
    return res
      .status(404)
      .json({ status: httpStatusText.FAIL, data: { course: null } });
  return res.json({ status: httpStatusText.SUCCESS, data: { course } });
});

const delete_course = asyncwrapper(async (req, res, next) => {
  const course = await Course.findByIdAndDelete(req.params.courseId);
  if (!course) {
    const error = appError.createError("Course Not Found", 404);
    return next(error);
  }
  return res.json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  get_all_courses,
  get_single_course,
  create_course,
  update_course,
  delete_course,
};
