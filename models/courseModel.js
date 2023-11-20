const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var CourseSchema = new mongoose.Schema({
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    coursename:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        required:true,
    },
    duration:{
        type: String,
        required: true
    },
    fees:{
        type:String,
        required:true,
    },
},{
    timestamps: true
});
    
//Export the model
module.exports = mongoose.model('Course', CourseSchema);