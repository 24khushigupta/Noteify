const express = require("express");
const multer = require("multer");
const path = require("path");
const Note = require("../models/Note");

const router = express.Router();

// where uploaded PDFs get saved on disk, and how they're named
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
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
    const { title, subjectCode, subjectName, course, semester } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "A PDF file is required" });
    }

    const note = await Note.create({
      title,
      subjectCode,
      subjectName,
      course,
      semester: Number(semester),
      fileUrl: `/uploads/${req.file.filename}`,
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