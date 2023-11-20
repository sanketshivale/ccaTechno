const express = require("express");
const router = express.Router();
const {authorize} = require('../middlewares/authMiddleware')
const {isAdmin} = require('../middlewares/isAdmin')

const { createBranch, getAllBranch } = require("../controllers/branchCtrl");

router.get("/",authorize, isAdmin, getAllBranch);

router.post("/",authorize, isAdmin, createBranch);

module.exports = router;
