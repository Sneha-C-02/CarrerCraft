import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/************************************
 * 1️⃣ GET ALL SKILLS
 ************************************/
router.get("/get", async (req, res) => {
  const { firebase_uid } = req.query;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });

  const { data, error } = await supabase
    .from("user_profiles")
    .select("resume_data")
    .eq("firebase_uid", firebase_uid)
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });

  const skills = data?.resume_data?.skills || [];
  res.json({ success: true, skills });
});


/************************************
 * 2️⃣ ADD A SKILL
 ************************************/
router.post("/add", async (req, res) => {
  const { firebase_uid, new_skill } = req.body;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });
  if (!new_skill) {
    return res.status(400).json({ success: false, message: "Skill is required" });
  }

  // fetch existing resume
  const { data: profile, error: fetchErr } = await supabase
    .from("user_profiles")
    .select("resume_data")
    .eq("firebase_uid", firebase_uid)
    .single();

  if (fetchErr) return res.status(500).json({ success: false, message: fetchErr.message });

  const oldSkills = profile?.resume_data?.skills || [];
  const updatedSkills = [...oldSkills, new_skill];
  const updatedResume = { ...profile.resume_data, skills: updatedSkills };

  // update DB
  const { error: updateErr } = await supabase
    .from("user_profiles")
    .update({ resume_data: updatedResume })
    .eq("firebase_uid", firebase_uid);

  if (updateErr) return res.status(500).json({ success: false, message: updateErr.message });

  res.json({ success: true, message: "Skill added ✔", skills: updatedSkills });
});

export default router;
