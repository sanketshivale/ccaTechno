const Branch = require("../models/branchModel");
const jwt = require("jsonwebtoken");

exports.authorize = async (req, res, next) => {
  const refreshToken = await req.cookies.refreshToken;
  if (!refreshToken) {
    req.session.message = {message: "Please Login Again"}
    res.redirect('/auth/login')
  } else {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECERT);
      const branch = await Branch.findById(decoded.id);
      req.branch = branch;
      next();
    } catch (error) {
      req.session.message = { message: error }
      res.redirect("/auth/login");
    }
  }
  
};
