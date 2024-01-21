// models/student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  roll_no: {
    type: Number,
    required: true,
  },
  name: String,
  year: Number,
  subjects: [String],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;