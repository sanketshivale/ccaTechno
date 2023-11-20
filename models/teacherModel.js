const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    fname: String,
    email: String,
    mobile: String,
    gender: String,
   
}, {
    timestamps: true
})

module.exports = mongoose.model("Teacher", teacherSchema)