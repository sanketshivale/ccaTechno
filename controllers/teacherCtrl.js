const Teacher = require("../models/teacherModel");
const { validateMongodbId } = require("../utils/validateMongodbId");
const Batch = require("../models/batchModel");

exports.register = async (req, res) => {
  try {
    const branchLoId = req.branch;
    const { email } = req.body;

    const findTeacher = await Teacher.findOne({ email });
    if (findTeacher) {
      req.session.message = {
        message: "Teacher Exists with the Email ID",
        type: "danger",
      };
    } else {
      await Teacher.create({ branch: branchLoId._id, ...req.body });
      req.session.message = {
        message: `Teacher Created with email ${req.body.email}`,
        type: "success",
      };
    }
    res.redirect("/teacher");
  } catch (error) {
    req.session.message = {
      message: "An error occurred while processing your request",
      type: "danger",
    };
    res.redirect("/teacher");
  }
};

exports.getAllTeacher = async (req, res) => {
  try {
    const {branch} = req;
    const getAllTeacher = await Teacher.find({ branch: branch._id });
    res.render("teacher", { title: "Teacher", getAllTeacher });
  } catch (error) {
    req.session.message = {
      message: "An error occurred while processing your request",
      type: "danger",
    };
    res.redirect("/teacher");
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const _id = await validateMongodbId(req.params.id);
    const checkTeacher = await Batch.findOne({ teacher: _id });
    if (!_id || checkTeacher) {
      req.session.message = {
        message: `Invalid Teacher ID or it might be assigned to batch ${checkTeacher.batchname}`,
        type: "danger",
      };
      return res.redirect("/teacher");
    }
    await Teacher.findByIdAndRemove({ _id });
    req.session.message = {
      type: "success",
      message: "Teacher Deleted Successfully",
    };
    res.redirect("/teacher");
  } catch (error) {
    req.session.message = {
      message: "An error occurred while processing your request",
      type: "danger",
    };
    res.redirect("/teacher");
  }
};
