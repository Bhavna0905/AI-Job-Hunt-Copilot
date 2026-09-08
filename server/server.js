const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const ollama = require("ollama").default;

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

    const aiResponse = await ollama.chat({
        model: "llama3.1:8b",
        messages: [
            {
            role: "user",
            content: `
        You are an expert resume reviewer.

        Analyze the following resume and provide:

        1. Overall resume score out of 100
        2. Top 3 strengths
        3. Top 3 weaknesses
        4. Top 5 improvement suggestions

        Resume:
        ${result.text}
            `,
            },
        ],
        });

    const analysis = aiResponse.message.content;

    res.json({
      message: "Resume analyzed successfully",
      fileName: req.file.originalname,
      text: result.text,
      analysis: analysis,
    });
  } catch (error) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      message: "Failed to process resume",
      error: error.message,
    });
  }
});

app.post("/api/jobs/match", async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        message: "Resume text and job description are required",
      });
    }

    const aiResponse = await ollama.chat({
      model: "llama3.1:8b",
      messages: [
        {
          role: "user",
          content: `
You are an expert AI career advisor.

Compare the candidate's resume with the given job description.

Provide:

1. Overall Match Score out of 100
2. Top 5 Matching Skills
3. Top 5 Missing or Weak Skills
4. Why the candidate is a good fit
5. Top 5 recommendations to improve their chances

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
          `,
        },
      ],
    });

    const analysis = aiResponse.message.content;

    res.json({
      message: "Job matched successfully",
      analysis,
    });

  } catch (error) {
    console.error("Job matching error:", error);

    res.status(500).json({
      message: "Failed to match job",
      error: error.message,
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});