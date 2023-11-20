const Admission = require('../models/admissionModel');
const Course = require('../models/courseModel');
const Batch = require('../models/batchModel');
const easyinvoice = require('easyinvoice');
const fs = require('fs');
const { validateMongodbId } = require("../utils/validateMongodbId");

exports.getStudentConfirm = async (req, res) => {
  try {
    const id = await validateMongodbId(req.params.id);
    if (!id) {
      req.session.message = { message: "Invalid Student ID", type: "danger" };
      return res.redirect("/student");
    }

    const findStudent = await Admission.findById(id).populate("course").populate("batch");
    const getAllBatch = await Batch.find({ bcourse: findStudent.course });

    if (findStudent) {
      res.render("singleStudent", { title: findStudent.fullname, findStudent, getAllBatch });
    } else {
      req.session.message = { message: "Student Not Found", type: "danger" };
      res.redirect("/admission");
    }
  } catch (error) {
    req.session.message = { message: "Error fetching student details", type: "danger" };
    res.redirect("/student");
  }
};

exports.getAllStudent = async (req, res) => {
  try {
    const {branch} = await req;
    const getAllStudent = await Admission.find({ branch: branch._id }).populate("course").populate("batch").sort({ fullname: 1 });
    res.render("student", { title: "Student", getAllStudent });
  } catch (error) {
    console.error("Error fetching students:", error);
    req.session.message = { message: "Error fetching students", type: "danger" };
    res.redirect("/student");
  }
};

exports.updateConfirm = async (req, res) => {
  try {
    const id = await validateMongodbId(req.params.id);
    const { batch, amount, mode } = req.body;

    if (!id) {
      req.session.message = { message: "Invalid Student ID", type: "danger" };
      return res.redirect("/student");
    }

    const admission = await Admission.findById(id);

    if (!admission) {
      req.session.message = { message: "Student Not Found", type: "danger" };
      return res.redirect("/student");
    }

    if (!batch) {
      if (admission.installment.paidamount + parseInt(amount) === admission.installment.totalamount) {
        const newInstallment = { amount: amount, mode: mode };
        admission.installments.push(newInstallment);
        admission.fees = "Fully Paid";
        admission.installment.total += 1;
        admission.installment.paidamount = admission.installment.paidamount + parseInt(amount);

        await admission.save();
        req.session.message = { message: "Fees installment updated and Total Fees Paid", type: "success" };
      } else if (admission.installment.paidamount + parseInt(amount) > admission.installment.totalamount) {
        req.session.message = { message: "Please Enter Correct Amount, you are exceeding", type: "danger" };
      } else {
        const newInstallment = { amount: amount, mode: mode };

        admission.installments.push(newInstallment);
        admission.fees = "Partially Paid";
        admission.installment.total += 1;
        admission.installment.paidamount = admission.installment.paidamount + parseInt(amount);

        await admission.save();
        req.session.message = { message: "Fees installment updated", type: "success" };
      }
    } else {
      const findStudent = await Admission.findById(id).populate("course").populate("batch");
      const confirm = await Admission.findByIdAndUpdate(
        { _id: id },
        { batch, status: 1, installment: { totalamount: findStudent.course.fees } },
        { new: true }
      );

      if (confirm) {
        req.session.message = { message: "Student Confirmed Successfully", type: "success" };
      } else {
        req.session.message = { message: "Student Not Confirmed", type: "danger" };
      }
    }

    res.redirect("#");
  } catch (error) {
    console.error("Error updating student confirmation:", error);
    req.session.message = { message: "Server Error", type: "danger" };
    res.redirect("#");
  }
};

exports.deleteAdmission = async (req, res) => {
  try {
    const id = await validateMongodbId(req.params.id);
    if (!id) {
      req.session.message = { message: "Invalid Student ID", type: "danger" };
      return res.redirect("/student");
    }

    await Admission.findByIdAndRemove(id);
    req.session.message = { message: "Student deleted successfully", type: "danger" };
    res.redirect("/student");
  } catch (error) {
    console.error("Error deleting admission:", error);
    req.session.message = { message: "Error deleting admission", type: "danger" };
    res.redirect("/student");
  }
};

exports.printInvoice = async (req, res) => {
  try {
    const id = await validateMongodbId(req.params.id);
    if (!id) {
      req.session.message = { message: "Invalid Student ID", type: "danger" };
      return res.redirect("/student");
    }

    const student = await Admission.findById(req.params.id).populate("course").populate("batch");

    const data = {
      images: {
        logo: "https://www.codingcircleacademy.com/src/images/CCA%20Icon.png",
        background: "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
      },
      sender: {
        company: "CCA TECHNO PVT LTD",
        address: "Shivaji Nagar, Parbhani",
        zip: "422203",
        city: "Parbhani",
        country: "India"
      },
      client: {
        company: student.fullname,
        address: student.address
      },
      information: {
        number: student._id,
        date: student.updatedAt.toLocaleDateString("en-GB"),
        "due-date": "-"
      },
      products: [
        {
          quantity: 1,
          description: student.course.coursename,
          "tax-rate": 18,
          price: student.course.fees
        }
      ],
      "bottom-notice": "Kindly pay your invoice at the cash counter. Feels great that you are part of CCA family.",
      settings: {
        currency: "INR"
      }
    };

    const result = await easyinvoice.createInvoice(data);

    const filePath = "./public/images/invoice.pdf";
    fs.writeFileSync(filePath, result.pdf, "base64");

    res.download(filePath, "invoice.pdf", (error) => {
      if (error) {
        console.error("Error downloading the invoice:", error);
        req.session.message = { message: "Error downloading the invoice", type: "danger" };
        res.redirect("/student");
      } else {
        fs.unlinkSync(filePath);
      }
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    req.session.message = { message: "Error generating invoice", type: "danger" };
    res.redirect("/student");
  }
};
