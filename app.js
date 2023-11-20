var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dotenv = require("dotenv").config();
var session = require("express-session");

//import various routes
var authRouter = require("./routes/auth");
var dashboardRouter = require("./routes/dashboard");
var admissionRouter = require("./routes/admission");
var courseRouter = require("./routes/course");
var teacherRouter = require("./routes/teacher");
var branchRouter = require("./routes/branch");
var studentRouter = require('./routes/student')
var batchRouter = require('./routes/batch')

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//Middlewares updates

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "The session secert",
    saveUninitialized: true,
    resave: false,
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//Routes Prefix
app.use("/auth", authRouter);
app.use("/", dashboardRouter);
app.use("/admission", admissionRouter);
app.use("/course", courseRouter);
app.use("/teacher", teacherRouter);
app.use("/branch", branchRouter);
app.use("/student", studentRouter);
app.use("/batch", batchRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "Error"});
});

module.exports = app;
