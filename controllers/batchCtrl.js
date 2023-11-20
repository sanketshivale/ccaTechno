const Batch = require("../models/batchModel");
const Course = require('../models/courseModel');
const Teacher = require('../models/teacherModel');
const Admission = require('../models/admissionModel');
const ExcelJS = require('exceljs');
const { validateMongodbId } = require("../utils/validateMongodbId");

const validateBatchId = async (id) => {
  const isValid = await validateMongodbId(id);
  if (!isValid) {
    throw new Error("Invalid Batch ID");
  }
};

exports.getBatch = async (req, res) => {
  const { branch } = req;
  const getAllCourse = await Course.find({ branch: branch._id });
  const getAllTeacher = await Teacher.find({ branch: branch._id });
  res.render("batch", { title: "Create Batch", getAllCourse, getAllTeacher });
};

exports.getSingleBatch = async (req, res) => {
  const { branch } = req;
  const { id } = req.params;
  try {
    await validateBatchId(id);
    const getSingleBatch = await Batch.findOne({ branch: branch._id, _id: id }).populate('teacher').populate('bcourse');
    const getBatchStudent = await Admission.find({ branch: branch._id, batch: { $in: [id] }, status: true }).populate('course').populate('batch');
    const getBatchStudentCount = getBatchStudent.length;
    res.render("singleBatch", { title: getSingleBatch.batchname, getSingleBatch, getBatchStudent, getBatchStudentCount });
  } catch (error) {
    req.session.message = { message: error.message };
    res.redirect("/course");
  }
};

exports.createBatch = async (req, res) => {
  const { branch } = req;
  const { batchname, teacher, bcourse } = req.body;
  const course_id = await Course.findById(bcourse);
  const teacher_id = await Teacher.findById(teacher);

  try {
    const findBatch = await Batch.findOne({ batchname, branch: branch._id });
    if (!findBatch && course_id && teacher_id) {
      const newBatch = await Batch.create({
        batchname,
        teacher: teacher_id._id,
        bcourse: course_id._id,
        branch: branch._id,
      });
      req.session.message = { message: "Batch Created Successfully", type: "success" };
      res.redirect(`course/${course_id._id}`);
    } else {
      req.session.message = { message: "Batch already present or try again" };
      res.redirect("/batch");
    }
  } catch (error) {
    req.session.message = { message: "Error Occurred, please try again", type: "danger" };
    res.redirect("/batch");
  }
};

exports.downloadStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await validateBatchId(id);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    const batch = await Batch.findById(id);
    const data = await Admission.find({ batch: { $in: [id] }, status: true }).populate('course').populate('batch');

    worksheet.addRow(['Student Name', 'Email', 'Gender', 'Mobile NO.', 'DOB', 'Parents Name', 'Parents Occupation', 'Parents Mobile No.', 'Aadhar NO.', 'Course', 'Batch', 'Address', 'Fees', 'Date of Admission', 'Status']);
    data.forEach(element => {
      worksheet.addRow([
        element.fullname, element.email, element.gender, element.mobile, element.dob,
        element.parentname, element.parentoccupation, element.parentphone, element.adharcard,
        element.course.coursename, element.batch.batchname, element.address, element.course.fees,
        element.createdAt.toDateString(), element.status
      ]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + batch.batchname + '.xlsx');

    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      })
      .catch((err) => {
        console.error('Error generating Excel file:', err);
        res.status(500).send('Error generating Excel file');
      });
  } catch (error) {
    req.session.message = { message: error.message };
    res.redirect("/course");
  }
};

exports.deleteBatch = async (req, res) => {
  const { id } = req.params;
  try {
    await validateBatchId(id);
    const batch = await Batch.findById(id);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    const data = await Admission.find({ batch: { $in: [id] }, status: true }).populate('course').populate('batch');

    worksheet.addRow(['Student Name', 'Email', 'Gender', 'Mobile NO.', 'DOB', 'Parents Name', 'Parents Occupation', 'Parents Mobile No.', 'Aadhar NO.', 'Course', 'Batch', 'Address', 'Fees', 'Date of Admission', 'Status']);
    data.forEach(element => {
      worksheet.addRow([
        element.fullname, element.email, element.gender, element.mobile, element.dob,
        element.parentname, element.parentoccupation, element.parentphone, element.adharcard,
        element.course.coursename, element.batch.batchname, element.address, element.course.fees,
        element.createdAt.toDateString(), element.status
      ]);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=' + batch.batchname + '.xlsx');

    await workbook.xlsx.writeFile('./public/excel/' + batch.batchname + '.xlsx');
    await Batch.findByIdAndDelete(id);
    await Admission.deleteMany({ batch: { $in: [id] }, status: true });

    req.session.message = { message: "Batch Deleted Successfully and its students as well", type: "success" };
    res.redirect('/course');
  } catch (error) {
    req.session.message = { message: error.message };
    res.redirect("/course");
  }
};
