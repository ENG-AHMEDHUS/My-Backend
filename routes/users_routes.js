const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users_controllers");
const validationScheme = require("../middleware/validationscheme");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const appError = require("../utils/appError");

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileExtension = file.mimetype.split("/")[1];
    const fileName = `IMG-${Date.now()}.${fileExtension}`;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype.split("/")[0];
  if (fileType === "image") {
    cb(null, true);
  } else {
    const error = appError.createError("Only image files are allowed", 400);
    return cb(error, false);
  }
};

const upload = multer({ storage: diskStorage, fileFilter });

router.route("/").get(verifyToken, usersControllers.getAllUsers); //Get all users

router
  .route("/register")
  .post(upload.single("avatar"), usersControllers.register);

router.route("/login").post(usersControllers.login);

// .post( validationScheme() ,usersControllers.create_user); //Create a new user

// router.route("/:userId")
// .get(usersControllers.get_single_user)                  //Get single user
// .patch( usersControllers.update_user)                   //Update a user
// .delete( usersControllers.delete_user);                 //Delete a user

module.exports = router;
