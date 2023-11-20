var express = require('express');
var router = express.Router();
const { register, getAllTeacher, deleteTeacher } = require("../controllers/teacherCtrl")
const {authorize} = require('../middlewares/authMiddleware')
/* GET Method. */
router.get('/',authorize, getAllTeacher);

/* Post Method */
router.post('/',authorize, register);

//delete Method
router.get("/deleteTeacher/:id",authorize, deleteTeacher)

module.exports = router;
