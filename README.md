# AI Job Hunt Copilot

A full-stack, AI-powered platform that helps job seekers analyze resumes, match against job descriptions, practice mock interviews, and track applications end to end.

Live Demo: https://ai-job-hunt-copilot-two.vercel.app

API: https://ai-job-hunt-copilot.onrender.com

Repository: https://github.com/Bhavna0905/AI-Job-Hunt-Copilot

---

## Overview

AI Job Hunt Copilot streamlines the job search process by combining resume intelligence, job-fit analysis, and interview preparation into a single application. It is built on a modern MERN-based stack with AI inference handled through the Groq API.

---

## Key Features

- **Resume Analyzer** — Extracts and analyzes resume content from PDF uploads, returning a score along with strengths, weaknesses, and improvement suggestions.
- **Job Matcher** — Compares resume content against a job description to generate a match score, matching skills, and skill gaps.
- **Mock Interview** — Runs an AI-driven interview flow with question generation, answer evaluation, follow-up questions, and a final summary with a hiring recommendation.
- **Application Tracker** — Full CRUD for job applications with per-user data isolation and dashboard statistics.
- **Authentication** — JWT-based auth with bcrypt password hashing, protected routes, and password reset with token expiration.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, JWT, bcrypt, Multer |
| AI | Groq API (`openai/gpt-oss-20b`) |
| Database | MongoDB Atlas, Mongoose |
| Deployment | Vercel (frontend), Render (backend) |

The AI layer was initially developed using a locally hosted Ollama model and later migrated to the Groq API for production-scale cloud deployment.

---

## Architecture

```text
React (Vercel) → Express API (Render) → Groq AI
                              |
                        MongoDB Atlas
```

---

## Core API Endpoints

```text
POST /api/auth/signup | login | forgot-password | reset-password
POST /api/resume/analyze
POST /api/jobs/match
POST /api/interview/start | evaluate | next | summary
GET|POST|PUT|DELETE /api/applications
```

---

## Getting Started

```bash
git clone https://github.com/Bhavna0905/AI-Job-Hunt-Copilot.git

# Backend
cd server && npm install
# .env -> MONGODB_URI, JWT_SECRET, GROQ_API_KEY
node server.js        # runs on localhost:5000

# Frontend
cd client && npm install
# .env -> VITE_API_URL=http://localhost:5000
npm run dev            # runs on localhost:5173
```

---

## Security

JWT authentication, bcrypt password hashing, protected API and frontend routes, per-user data isolation, environment-based secrets, and expiring password reset tokens.

---

## Roadmap

Email-based password reset, real-time job search integration, resume version history, advanced application analytics, and a custom domain.

---

## Author

**Bhavna Meemroth**

GitHub: https://github.com/Bhavna0905