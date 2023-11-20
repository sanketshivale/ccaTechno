const express = require('express')
const router = express.Router()
const {getStudentConfirm, updateConfirm, getAllStudent,deleteAdmission, printInvoice} = require("../controllers/studentCtrl")
const {authorize} = require('../middlewares/authMiddleware')

router.get("/",authorize, getAllStudent)
router.get("/confirm/:id",authorize, getStudentConfirm)

router.post("/confirm/:id",authorize, updateConfirm)

router.get("/delete/:id",authorize, deleteAdmission)

router.get("/print/:id",authorize, printInvoice)



module.exports = router 