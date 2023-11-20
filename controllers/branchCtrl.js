const Branch = require("../models/branchModel");
const { generateRefreshToken } = require("../bin/refreshToken");

exports.getAllBranch = async (req, res) => {
try {
const getAllBranch = await Branch.find();
res.render("branch", { title: "Branch", getAllBranch });
} catch (error) {
req.session.message = { message: "Error fetching branches", type: "danger" };
res.redirect("/branch");
}
};

exports.createBranch = async (req, res) => {
try {
const { branchname } = req.body;
const findBranch = await Branch.findOne({ branchname });
if (!findBranch) {
await Branch.create(req.body);
req.session.message = {
message: "Branch Created Successfully",
type: "success",
};
} else {
req.session.message = {
message: "Branch Already Exists with That Name",
type: "danger",
};
}
res.redirect("/branch");
} catch (error) {
req.session.message = { message: "Error creating branch", type: "danger" };
res.redirect("/branch");
}
};