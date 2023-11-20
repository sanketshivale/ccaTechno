const express = require('express')
const router = express.Router()
const { getAdmission, createAdmission } = require("../controllers/admissionCtrl")
const {authorize} = require('../middlewares/authMiddleware')


router.get("/",authorize, getAdmission)

router.post("/",authorize, createAdmission)

module.exports = router