const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");
const connectDB=require("./config/db");
const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");
const path = require("path");
const mongoose = require("mongoose");
dotenv.config();
const app =express();
connectDB();

app.use(cors());
app.use(express.json());
console.log("Registering auth routes...");
app.use("/api/auth", authRoutes);
app.get("/",(req,res)=>{
    res.send("KHUSHI TEST SERVER");
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/notes", noteRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});