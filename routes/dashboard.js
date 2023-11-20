var express = require("express");
var router = express.Router();
const { authorize } = require('../middlewares/authMiddleware')

const {getDashboard} = require('../controllers/dashboardCtrl')
/* GET home page. */
router.get("/",authorize, getDashboard);

router.get("/profile",authorize, (req, res, next) => {
  res.render("profile", { title: "Profile" });
});

router.get("/setting",authorize, (req, res, next) => {
  res.render("setting", { title: "Setting" });
});

module.exports = router;
