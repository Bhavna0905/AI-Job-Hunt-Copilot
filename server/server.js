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

// =====================================================
// RESUME ANALYZER
// =====================================================

app.post("/api/resume/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No resume file uploaded",
      });
    }

    // Create PDF parser using uploaded file buffer
    const parser = new PDFParse({
      data: req.file.buffer,
    });

    // Extract text
    const result = await parser.getText();

    // Free parser resources
    await parser.destroy();

    // Send resume to Ollama
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

// =====================================================
// JOB MATCHER
// =====================================================

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

// =====================================================
// AI INTERVIEW - START
// =====================================================

app.post("/api/interview/start", async (req, res) => {
  try {
    const {
      jobRole,
      interviewType,
      difficulty,
    } = req.body;

    if (!jobRole || !interviewType || !difficulty) {
      return res.status(400).json({
        message: "Job role, interview type and difficulty are required",
      });
    }

    const aiResponse = await ollama.chat({
      model: "llama3.1:8b",
      messages: [
        {
          role: "user",
          content: `
You are an expert AI interviewer.

Conduct an interview for the following candidate:

Job Role: ${jobRole}
Interview Type: ${interviewType}
Difficulty: ${difficulty}

Generate the FIRST interview question.

Rules:
- Ask only ONE question.
- Make it relevant to the job role.
- Match the selected interview type.
- Match the selected difficulty.
- Do not provide the answer.
- Keep the question clear and professional.
          `,
        },
      ],
    });

    const question = aiResponse.message.content;

    res.json({
      message: "Interview started successfully",
      question,
    });

  } catch (error) {
    console.error("Interview error:", error);

    res.status(500).json({
      message: "Failed to start interview",
      error: error.message,
    });
  }
});

// =====================================================
// AI INTERVIEW - EVALUATE ANSWER
// =====================================================

app.post("/api/interview/evaluate", async (req, res) => {
  try {
    const {
      jobRole,
      question,
      answer,
    } = req.body;

    if (!jobRole || !question || !answer) {
      return res.status(400).json({
        message: "Job role, question and answer are required",
      });
    }

    const aiResponse = await ollama.chat({
      model: "llama3.1:8b",
      messages: [
        {
          role: "user",
          content: `
You are an expert technical interviewer.

Evaluate the candidate's answer for the following interview question.

Job Role:
${jobRole}

Question:
${question}

Candidate's Answer:
${answer}

Provide:

1. Score out of 100
2. What the candidate did well
3. What could be improved
4. A better sample answer

Be constructive and professional.
          `,
        },
      ],
    });

    const evaluation = aiResponse.message.content;

    res.json({
      message: "Answer evaluated successfully",
      evaluation,
    });

  } catch (error) {
    console.error("Interview evaluation error:", error);

    res.status(500).json({
      message: "Failed to evaluate answer",
      error: error.message,
    });
  }
});

// =====================================================
// AI INTERVIEW - NEXT QUESTION
// =====================================================

app.post("/api/interview/next", async (req, res) => {
  try {
    const {
      jobRole,
      interviewType,
      difficulty,
      previousQuestion,
      previousAnswer,
    } = req.body;

    if (
      !jobRole ||
      !interviewType ||
      !difficulty ||
      !previousQuestion ||
      !previousAnswer
    ) {
      return res.status(400).json({
        message: "Interview details and previous answer are required",
      });
    }

    const aiResponse = await ollama.chat({
      model: "llama3.1:8b",
      messages: [
        {
          role: "user",
          content: `
You are an expert AI interviewer.

Continue the interview for this candidate.

Job Role:
${jobRole}

Interview Type:
${interviewType}

Difficulty:
${difficulty}

Previous Question:
${previousQuestion}

Previous Answer:
${previousAnswer}

Generate the NEXT interview question.

Rules:
- Ask only ONE question.
- Do not repeat the previous question.
- Make the question relevant to the job role.
- Match the interview type and difficulty.
- Build naturally on the previous answer when appropriate.
- Do not provide the answer.
- Keep the question clear and professional.
          `,
        },
      ],
    });

    const question = aiResponse.message.content;

    res.json({
      message: "Next question generated successfully",
      question,
    });

  } catch (error) {
    console.error("Next question error:", error);

    res.status(500).json({
      message: "Failed to generate next question",
      error: error.message,
    });
  }
});

// =====================================================
// START SERVER
// =====================================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});