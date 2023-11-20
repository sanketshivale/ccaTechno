var express = require("express");
var router = express.Router();
const {
  getLogin,
  loginBranch,
  logoutBranch,
} = require("../controllers/authCtrl");

/* GET home page. */
router.get("/login", getLogin);

router.post("/login", loginBranch);
router.get("/logout", logoutBranch);


module.exports = router;
