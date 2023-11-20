const mongoose = require("mongoose");

// Declare the Schema of the Mongo model
var batchSchema = new mongoose.Schema({
  
  batchname: {
    type: String,
    required: true,
    unique: true,
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'

  },
  bcourse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
}
}, {
  timestamps: true  
});



//Export the model
module.exports = mongoose.model("Batch", batchSchema);
