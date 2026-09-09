require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const ollama = require("ollama").default;
const mongoose = require("mongoose");
const Application = require("./models/Application");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

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
// AUTH - SIGNUP
// =====================================================

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
});

// =====================================================
// AUTH - LOGIN
// =====================================================

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
});

// =====================================================
// APPLICATION TRACKER
// =====================================================

// GET all applications
app.get("/api/applications", async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Fetch applications error:", error);

    res.status(500).json({
      message: "Failed to fetch applications",
      error: error.message,
    });
  }
});

// POST a new application
app.post("/api/applications", async (req, res) => {
  try {
    const { company, jobRole, status, date, notes } = req.body;

    if (!company || !jobRole) {
      return res.status(400).json({
        message: "Company and job role are required",
      });
    }

    const application = await Application.create({
      company,
      jobRole,
      status,
      date,
      notes,
    });

    res.status(201).json(application);
  } catch (error) {
    console.error("Create application error:", error);

    res.status(500).json({
      message: "Failed to create application",
      error: error.message,
    });
  }
});

// UPDATE an application
app.put("/api/applications/:id", async (req, res) => {
  try {
    const { company, jobRole, status, date, notes } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        company,
        jobRole,
        status,
        date,
        notes,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json(application);
  } catch (error) {
    console.error("Update application error:", error);

    res.status(500).json({
      message: "Failed to update application",
      error: error.message,
    });
  }
});

// DELETE an application
app.delete("/api/applications/:id", async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error("Delete application error:", error);

    res.status(500).json({
      message: "Failed to delete application",
      error: error.message,
    });
  }
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
You are a strict technical interviewer evaluating a candidate's answer.

Job Role: ${jobRole}

Interview Question:
${question}

Candidate's Answer:
${answer}

Evaluate the candidate based ONLY on how correctly and completely they answered the question.

Scoring rules:
- 90-100: Excellent. Correct, complete, and demonstrates strong understanding.
- 75-89: Good. Mostly correct with only minor issues or missing details.
- 50-74: Partial. Some correct understanding, but important concepts are missing or incorrect.
- 25-49: Weak. The answer shows limited understanding and contains major mistakes.
- 0-24: Wrong or irrelevant answer, no meaningful understanding, or the candidate does not answer the question.

Important:
- Do NOT give a high score just because the candidate sounds confident.
- Do NOT reward an answer simply for being detailed.
- Incorrect technical information must significantly reduce the score.
- A partially correct answer must receive a partial score.
- A completely incorrect answer must receive a very low score.
- If the candidate says they don't know, cannot answer, or gives an irrelevant response, score it very low.
- Judge the answer against the actual question, not against how well-written it is.

Return:
1. Score out of 100
2. What the candidate did well
3. What was incorrect or missing
4. A better sample answer

Be strict and realistic, like an actual interviewer.
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
You are an AI interviewer.

Job Role: ${jobRole}
Interview Type: ${interviewType}
Difficulty: ${difficulty}

Previous Question:
${previousQuestion}

Previous Answer:
${previousAnswer}

Generate ONE new interview question.

Rules:
- Do not repeat the previous question.
- Keep it relevant to the job role.
- Match the interview type and difficulty.
- Keep it concise.
- Do not provide an answer.

Return only the question.
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

// Generate final interview summary
app.post("/api/interview/summary", async (req, res) => {
  try {
    const {
      jobRole,
      interviewType,
      difficulty,
      interviewData,
    } = req.body;

    if (!jobRole || !interviewType || !difficulty || !interviewData) {
      return res.status(400).json({
        message: "Interview details and interview data are required",
      });
    }

    const aiResponse = await ollama.chat({
      model: "llama3.1:8b",
      messages: [
        {
          role: "user",
          content: `
You are an expert interview evaluator.

Analyze the candidate's complete interview performance.

Job Role:
${jobRole}

Interview Type:
${interviewType}

Difficulty:
${difficulty}

Interview Performance:
${JSON.stringify(interviewData, null, 2)}

Return ONLY valid JSON.

Do not use Markdown.
Do not use code blocks.
Do not add any text before or after the JSON.

Use exactly this structure:

{
  "overallScore": 75,
  "overallPerformance": "Short overall assessment",
  "strengths": [
    "Strength 1",
    "Strength 2",
    "Strength 3"
  ],
  "areasToImprove": [
    "Area 1",
    "Area 2",
    "Area 3"
  ],
  "finalFeedback": "Short final feedback",
  "hiringRecommendation": "Potential Candidate"
}

The hiringRecommendation must be exactly one of:
"Strong Candidate"
"Potential Candidate"
"Needs More Preparation"

overallScore must be a number between 0 and 100.
          `,
        },
      ],
      format: "json",
    });

    const summary = JSON.parse(aiResponse.message.content);
    
    const scores = interviewData
        .map((item) => {
            const match = item.evaluation.match(/Score:\s*(\d{1,3})\s*\/\s*100/i);
            return match ? Number(match[1]) : null;
        })
        .filter((score) => score !== null);

        if (scores.length > 0) {
        const averageScore =
            scores.reduce((sum, score) => sum + score, 0) / scores.length;

        summary.overallScore = Math.round(averageScore);

        if (summary.overallScore >= 80) {
            summary.hiringRecommendation = "Strong Candidate";
        } else if (summary.overallScore >= 50) {
            summary.hiringRecommendation = "Potential Candidate";
        } else {
            summary.hiringRecommendation = "Needs More Preparation";
        }
        }

    res.json({
      message: "Interview summary generated successfully",
      summary,
    });

  } catch (error) {
    console.error("Interview summary error:", error);

    res.status(500).json({
      message: "Failed to generate interview summary",
      error: error.message,
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});