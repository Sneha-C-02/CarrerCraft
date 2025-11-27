import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/**********************************************
 * 1️⃣ JOB SUGGESTIONS (skills → job list)
 **********************************************/
router.post("/suggest", async (req, res) => {
  const { firebase_uid, skills } = req.body;

  if (!skills?.length) return res.status(400).json({ success: false, message: "skills required" });

  const jobList = [
    { id: 1, title: "Frontend Developer", company: "TechNova", location: "Bangalore", required: ["React", "JavaScript", "CSS"] },
    { id: 2, title: "UI/UX Engineer", company: "DesignFlow", location: "Remote", required: ["Figma", "UX", "CSS"] },
    { id: 3, title: "Full-Stack Dev", company: "InnovateX", location: "Hyderabad", required: ["React", "Node.js", "MongoDB"] }
  ];

  const suggested = jobList.map(job => {
    const match = job.required.filter(r => skills.includes(r)).length;
    return { ...job, matchScore: Math.round((match / job.required.length) * 100) };
  }).sort((a, b) => b.matchScore - a.matchScore);

  res.json({ success: true, jobs: suggested });
});


/**********************************************
 * 2️⃣ RESUME → JOB MATCH SCORE
 **********************************************/
router.post("/match", async (req, res) => {
  const { resume, job } = req.body;

  if (!resume || !job) return res.status(400).json({ success: false, message: "resume + job needed" });

  const count = job.required.filter(s => resume.skills.includes(s)).length;
  const score = Math.round((count / job.required.length) * 100);

  res.json({ success: true, matchScore: score });
});


/**********************************************
 * 3️⃣ JOB SEARCH HISTORY
 **********************************************/
router.post("/history/add", async (req, res) => {
  const { firebase_uid, job_title } = req.body;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });
  if (!job_title) return res.status(400).json({ success: false, message: "job_title required" });

  const { error } = await supabase.from("job_history").insert({ firebase_uid, job_title });

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, message: "History saved" });
});


router.get("/history", async (req, res) => {
  const { firebase_uid } = req.query;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });

  const { data, error } = await supabase
    .from("job_history")
    .select("*")
    .eq("firebase_uid", firebase_uid)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, history: data });
});

export default router;
