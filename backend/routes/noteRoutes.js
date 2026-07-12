const express = require("express");
const multer = require("multer");
const path = require("path");
const Note = require("../models/Note");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// where uploaded PDFs get saved on disk, and how they're named
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Noteify",
    resource_type: "raw", // PDF upload ke liye
   //  public_id:()=> Date.now().toString(),
   // formats: "pdf",
  },
});

// only accept PDFs, cap size at 15mb
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});


// GET /api/notes/subjects
router.get("/subjects/all", async (req, res) => {
  try {
    const subjects = await Note.aggregate([
      {
        $group: {
          _id: "$subjectCode",
          code: { $first: "$subjectCode" },
          name: { $first: "$subjectName" },
          course: { $first: "$course" },
          sem: { $first: "$semester" },
          notes: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          code: 1,
          name: 1,
          course: 1,
          sem: 1,
          notes: 1
        }
      }
    ]);

    res.json(subjects);
  } catch (err) {
     console.error("UPLOAD ERROR:");
  console.error(err);

    res.status(500).json({ error: err.message });
  }
});
// GET /api/notes
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/notes?course=MCA&semester=4  - list notes, optionally filtered
router.get("/:code", async (req, res) => {
  try {
     const notes = await Note.find({
      subjectCode: {
        $regex: `^${req.params.code}$`,
        $options: "i", // ignore uppercase/lowercase
      },
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// POST /api/notes  - upload a new note
router.post("/", upload.single("file"), async (req, res) => {
  try {
     console.log("REQ.FILE =", req.file);
    const { title, subjectCode, subjectName, course, semester } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "A PDF file is required" });
    }
   console.dir(req.file, { depth: null });
    const note = await Note.create({
      title,
      subjectCode,
      subjectName,
      course,
      semester: Number(semester),
      fileUrl: req.file.path,
      fileName: req.file.originalname,
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// DELETE /api/notes/:id
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;