var express = require("express");
var router = express.Router();
const {
  getCreateCourse,
  createCourse,
  getAllCourse,
  deleteCourse,
  getSingleCourse,
  // getAllBatch,
  // createBatch,
  // deleteBatch
} = require("../controllers/courseCtrl");

const {authorize} = require('../middlewares/authMiddleware')


// Create, delete Course

/* GET Method. */
router.get("/",authorize, getAllCourse);
router.get("/create",authorize, getCreateCourse);
router.get('/:course_id', getSingleCourse)



/* Post Method */
router.post("/create",authorize, createCourse);

/* Delete Method */
router.get("/deleteCourse/:id",authorize, deleteCourse);







module.exports = router;
