const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subjectCode: { type: String, required: true, trim: true }, // e.g. "MCA402"
    subjectName: { type: String, required: true, trim: true }, // e.g. "Database Management Systems"
    course: { type: String, required: true, enum: ["MCA", "BCA"] },
    semester: { type: Number, required: true, min: 1, max: 6 },
    fileUrl: { type: String, required: true }, // path or cloud URL to the PDF
    fileName: { type: String, required: true },
    uploadedBy: { type: String, default: "admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);