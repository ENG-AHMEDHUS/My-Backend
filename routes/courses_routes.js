const express = require("express");

const router = express.Router();

const coursesControllers = require("../controllers/courses_controllers");
const validationScheme = require("../middleware/validationscheme");
const verifyToken = require("../middleware/verifyToken");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

router
  .route("/")
  .get(coursesControllers.get_all_courses) //Get all courses
  .post(verifyToken, validationScheme(), coursesControllers.create_course); //Create a new course

router
  .route("/:courseId")
  .get(coursesControllers.get_single_course) //Get single course
  .patch(verifyToken, coursesControllers.update_course) //Update a course
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANGAR),
    coursesControllers.delete_course,
  ); //Delete a course

module.exports = router;
