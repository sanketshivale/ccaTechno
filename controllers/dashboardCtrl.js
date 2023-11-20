const Admission = require("../models/admissionModel");
const Teacher = require("../models/teacherModel");
const Course = require("../models/courseModel");


exports.getDashboard = async (req, res) => {
    try {
        const branchUser = await req.branch;

        const getAllStudent = await Admission.count({ branch: branchUser._id });
        const getAllTeacher = await Teacher.count({ branch: branchUser._id });
        const getAllCourse = await Course.count({ branch: branchUser._id });
        const getAllPending = await Admission.count({ branch: branchUser._id, status: "0" });
        const AllStudent = await Admission.find({ branch: branchUser._id }).populate('course').populate('batch').sort({ "fullname": 1 });

        // Check if there are any documents before running the aggregation
        const admissionCount = await Admission.count() || 0;
        let feescount = { totalamount: 0, collectedamount: 0 };
        if (admissionCount > 0) {
            feescount = await Admission.aggregate([{ $group: { _id: null, totalamount: { $sum: "$installment.totalamount" }, collectedamount: { $sum: "$installment.paidamount" } } }]);
        }
        const forAdmin = await Admission.find().populate('course').populate('batch').populate('branch').sort({ "fullname": 1 });
        res.render("dashboard", { title: "Dashboard", getAllCourse, getAllStudent, getAllTeacher, getAllPending, branchUser, forAdmin, feescount, AllStudent });
    } catch (err) {

        res.redirect("/admission");
    }
}