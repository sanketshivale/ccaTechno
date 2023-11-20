const Admission = require("../models/admissionModel")
const Course = require('../models/courseModel')


exports.getAdmission = async (req, res) => {
    const branch = await req.branch
    const getAllAdmission = await Admission.find({branch: branch._id,status: 0}).populate('course').populate('batch').sort( { "fullname": 1 } ) ;
    const getAllCourse = await Course.find({branch: branch._id}) ;
    res.render("admission", { title: "Admission", getAllAdmission, getAllCourse })
}


exports.createAdmission = async (req, res) => {
  try {
    const branchLoId = await req.branch;
    const email = await req.body.email;
    const findStudent = await Admission.findOne({ email });

    if (!findStudent) {
      await Admission.create({ branch: branchLoId._id, ...req.body } );
      req.session.message = {
        type: "success",
        message: `Registered Successfully for ${req.body.fullname}`,
      };
    } else {
      req.session.message = {
        message: "Admission Already Exists With That Email",
        type: "danger",
      };
    }
    res.redirect("/admission");
  } catch (error) {
    console.error("Error creating Admission:", error);
    req.session.message = {
      message: "Error creating Admission",
      type: "danger",
    };
    res.redirect("/admission");
  }
};