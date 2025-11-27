import express from "express";
import { OpenAI } from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 📌 AI Resume Evaluation + Skill Gap + Suggestions
router.post("/analyze", async (req, res) => {
  try {
    const resume = req.body;

    const prompt = `
    You are a professional ATS resume evaluator.
    Analyze this resume and return:

    1. ATS Score (0–100)
    2. Strengths in resume
    3. Weak areas
    4. Skill gaps with recommended skills
    5. Rewrite an improved summary in 3–4 lines

    Resume Data: ${JSON.stringify(resume, null, 2)}
    `;

    const ai = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return res.json({ success: true, result: ai.choices[0].message.content });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
