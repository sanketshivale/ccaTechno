const Course = require("../models/courseModel")
const Batch = require('../models/batchModel')
const Teacher = require('../models/teacherModel')
const { validateMongodbId } = require("../utils/validateMongodbId")


exports.getAllCourse = async (req, res) => {
    const branch =await req.branch
    const getAllCourse = await Course.find({branch: branch._id});
    res.render("course", { title: "Course", getAllCourse })
}
exports.getCreateCourse = async (req, res) => {
    res.render("createcourse", { title: "Create Course" })
}

exports.createCourse = async (req, res) => {
    const branchLoId = await req.branch
    const coursename = await req.body.coursename;
    const findCourse = await Course.findOne( {coursename, branch: branchLoId._id } )
    
    if (!findCourse) {
        await Course.create({ branch: branchLoId._id, ...req.body })
        req.session.message = { type: "success", message: `Course Created Succesfully ${req.body.coursename}` }
        res.redirect("/course")
    }else {
        req.session.message = { message: "Course already Exists with that name", type: 'danger' }
        res.redirect("/course/create")
    }
    

}

exports.getSingleCourse = async(req,res)=>{
    let id = await validateMongodbId(req.params.course_id)
    if(!id){
        req.session.message = {message: "Invalid Course ID", type: 'danger'}
        res.redirect('/course')
    }else{

    const findSCourse = await Course.findById(id)
    const getBatchCourseWise = await Batch.find({bcourse: id}).populate('teacher')

    if(findSCourse){
        res.render("singleCourse", {title: findSCourse.coursename, findSCourse, getBatchCourseWise})

    }else{
        req.session.message = {message: "No course available"}
        res.redirect('/course')
    }
}
}

exports.deleteCourse = async (req, res) => {
    let id = await validateMongodbId(req.params.id)
    if(!id){
        req.session.message = {message: "Invalid Course ID", type: 'danger'}
        res.redirect('/course')
    }else{

    await Course.findByIdAndRemove(id)
    req.session.message = { message: `Course Deleted Successfully`, type: 'danger' }
    res.redirect("/course")
}
}
