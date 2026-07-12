const express = require("express");
const multer = require("multer");

const Note = require("../models/Note");

const cloudinary = require("../config/cloudinary");

const router = express.Router();

// where uploaded PDFs get saved on disk, and how they're named
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
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
    const { title, subjectCode, subjectName, course, semester } = req.body;

    if (!req.file) {
      return res.status(400).json({
        error: "A PDF file is required",
      });
    }
    const fileName = `${Date.now()}.pdf`;
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "Noteify",
          resource_type: "raw",
          public_id: fileName,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(req.file.buffer);
    });

    const note = await Note.create({
      title,
      subjectCode,
      subjectName,
      course,
      semester: Number(semester),
      fileUrl: uploadResult.secure_url,
      fileName: req.file.originalname,
    });

    res.status(201).json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
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