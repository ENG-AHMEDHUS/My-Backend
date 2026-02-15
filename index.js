require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5001;
const path = require("path");

app.use(cors());
app.use(express.json());
//CRUD (Create ,Read ,Update ,Delete)

//upload static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//connect to the database
const mongoose = require("mongoose");

const httpStatusText = require("./utils/httpstatustext");

const url=process.env.MONGO_URL;

mongoose.connect(url)
.then(() => console.log("connected to the database successfully"))
.catch((err) => console.log("error connecting to the database: ", err));

const coursesRoutes = require("./routes/courses_routes");
app.use("/api/courses",coursesRoutes);

const userRoutes = require("./routes/users_routes");
app.use("/api/users",userRoutes);

app.use((req,res) => {
  return res.status(404).json({ status: httpStatusText.ERROR, data: null, message: "Route Not Found" });
});
// Global Error Handler
app.use((error,req,res,next) => {
  return res.status(error.status || 500).json({ status: httpStatusText.ERROR, message: error.message || "Internal Server Error" });
});

app.listen(port, () => {
  console.log("listen at port: ", port);
});
