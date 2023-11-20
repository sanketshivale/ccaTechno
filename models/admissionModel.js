const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

var InstallmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now(),
    },
    amount: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        required: true,
        enum: ['Cash', 'Online']
    }
}, { _id: false });

var AdmissionSchema = new mongoose.Schema({
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true
    },
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },    
    gender:{
        type: String,
        required: true
    },
    dob : {
        type: String,
    },
    parentname:{
        type:String,
    },
    parentoccupation:{ 
        type:String,
    },
    parentphone:{
        type:String,
    },
    adharcard:{
        type:String,

    },
    mobile:{
        type:String,
        required:true,
    },
    address: { 
            type:String,
            required:true,
        },
    education: {
         edu: {
            type: String,
            required: true
         },
         year: {
            type: String,
            required: true
         }
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch'
    },
    status: {
        type: Boolean,
        default: false
    },
    fees: {
        type: String,
        default: "Not Paid",
        enum: ["Not Paid", "Partially Paid", "Fully Paid"]
    },
    installments: [InstallmentSchema],
    installment: {
        total: {
          type: Number,
          default: 0
        },
        paidamount: {
          type: Number,
          default: 0
        },
        totalamount: {
          type: Number,
          default: 0
        }
      }

},{
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Admission', AdmissionSchema);