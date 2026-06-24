import { Router } from "express";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.post("/", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const folder = String(req.body.folder || "misc").replace(/[^a-z0-9-_]/gi, "");

    const result = await uploadToCloudinary(req.file.buffer, {
      folder,
      filename: req.file.originalname,
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
    });
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Upload failed",
    });
  }
});

export default router;
