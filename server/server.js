const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");

const app = express();

app.use(cors());
app.use(express.json());

// Store uploaded PDF in memory
const upload = multer({
  storage: multer.memoryStorage(),
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AI Job Hunt Copilot API is running 🚀",
  });
});

// Resume upload + PDF text extraction
app.post("/api/resume/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No resume file uploaded",
      });
    }

    // Create PDF parser using the uploaded file buffer
    const parser = new PDFParse({
      data: req.file.buffer,
    });

    // Extract text
    const result = await parser.getText();

    // Free parser resources
    await parser.destroy();

    res.json({
      message: "Resume uploaded successfully",
      fileName: req.file.originalname,
      text: result.text,
    });
  } catch (error) {
    console.error("PDF parsing error:", error);

    res.status(500).json({
      message: "Failed to process resume",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});