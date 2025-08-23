import express from "express";
import upload from "../middleware/multer.js";

const router = express.Router();

// Upload single image
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    console.log("📤 Upload request received");
    console.log("📁 File details:", req.file);
    
    if (!req.file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ 
        success: false, 
        error: "No file uploaded" 
      });
    }

    console.log("✅ File uploaded successfully:", req.file.path);
    res.json({
      success: true,
      url: req.file.path, // Cloudinary URL
      message: "Image uploaded successfully"
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ 
      success: false, 
      error: err.message || "Upload failed"
    });
  }
});

export default router;