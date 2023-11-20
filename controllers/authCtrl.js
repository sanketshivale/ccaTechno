const Branch = require("../models/branchModel");
const { generateRefreshToken } = require("../bin/refreshToken");
const { Session } = require("express-session");

exports.getLogin = (req, res) => {
  res.render("login", { title: "Login" });
};

exports.loginBranch = async (req, res) => {
  const { branchname, password } = req.body;
  const findBranch = await Branch.findOne({ branchname });

  if (findBranch && findBranch.isPasswordMatched(password)) {
    const refreshToken = await generateRefreshToken(findBranch?._id);
    const updateBranch = await Branch.findByIdAndUpdate(
      findBranch?._id,
      { refreshToken: refreshToken },
      { new: true }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 1000,
    });
    res.redirect("/");
  } else {
    req.session.message = {
      message: "Invalid Credentials, Enter Correct Details",
    };
    res.redirect("/auth/login");
  }
};

exports.logoutBranch = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(refreshToken);

  const branch = await Branch.findOneAndUpdate(
    { refreshToken },
    { refreshToken: "" }
  );

  if (!branch) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    req.session.message = { message: "Logout" };
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });

  req.session.message = { message: "Logout" };
  res.redirect("/auth/login");
};