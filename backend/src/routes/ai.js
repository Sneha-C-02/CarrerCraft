import express from 'express';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

/**
 * Simple heuristic resume scorer:
 * - Counts skills matched to market (very basic)
 * - Scores out of 100
 * - Returns suggestions and top gaps
 *
 * resume expected format:
 * {
 *   skills: ["React","Node.js"],
 *   summary: "...",
 *   experience: [{company,position,duration,description}, ...]
 * }
 */

function scoreResume(resume) {
  // Basic scoring weights
  const base = 40; // baseline for having resume
  let score = base;
  const suggestions = [];
  const gaps = [];

  const skills = Array.isArray(resume.skills) ? resume.skills.map(s => s.toLowerCase()) : [];
  const summary = (resume.summary || "").trim();

  // 1) Skills coverage: each skill +6 points up to 30
  const skillPoints = Math.min(skills.length * 6, 30);
  score += skillPoints;

  // 2) Experience length: if there are items, +15
  if (Array.isArray(resume.experience) && resume.experience.length > 0) {
    score += Math.min(15, resume.experience.length * 5);
  } else {
    suggestions.push('Add detailed experience entries with achievements (use numbers).');
    gaps.push('Work Experience');
  }

  // 3) Summary quality
  if (summary.length > 20) {
    score += 10;
  } else {
    suggestions.push('Write a concise 2-3 sentence summary with key skills + impact.');
    gaps.push('Professional Summary');
  }

  // 4) Quantification: check if description contains % or numbers
  const combinedDesc = (resume.experience || []).map(e => e.description || '').join(' ');
  const hasNumbers = /\d+%?/.test(combinedDesc) || /\b\d{1,3}\b/.test(combinedDesc);
  if (hasNumbers) {
    score += 5;
  } else {
    suggestions.push('Quantify achievements (e.g., "reduced load time by 30%").');
    gaps.push('Quantified Achievements');
  }

  // 5) Deduct if too short
  if (skills.length === 0) {
    score -= 10;
    gaps.push('Skills');
  }

  // normalize to 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // top unique gaps (limit 5)
  const uniqueGaps = Array.from(new Set(gaps)).slice(0, 5);

  return { score, suggestions, gaps: uniqueGaps };
}

router.post('/score', async (req, res) => {
  const { firebase_uid, resume } = req.body;
  if (!firebase_uid || !resume) {
    return res.status(400).json({ success: false, message: 'firebase_uid and resume required' });
  }

  // run deterministic scorer
  const { score, suggestions, gaps } = scoreResume(resume);

  // persist into resume_ai_history
  const { data, error } = await supabase
    .from('resume_ai_history')
    .insert([{ firebase_uid, resume, score, gaps: gaps, suggestions }])
    .select();

  if (error) {
    return res.status(500).json({ success: false, message: 'Error saving AI history', error: error.message });
  }

  res.json({
    success: true,
    score,
    suggestions,
    gaps,
    saved: data?.[0] ?? null
  });
});

/**
 * GET /ai/history?firebase_uid=...
 * returns last 20 history records
 */
router.get('/history', async (req, res) => {
  const { firebase_uid } = req.query;
  if (!firebase_uid) return res.status(400).json({ success: false, message: 'firebase_uid required' });

  const { data, error } = await supabase
    .from('resume_ai_history')
    .select('*')
    .eq('firebase_uid', firebase_uid)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ success: false, message: 'Error fetching history', error: error.message });

  res.json({ success: true, history: data });
});

export default router;
