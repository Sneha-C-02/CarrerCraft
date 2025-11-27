import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/************************************
 * 🔹 GET RESUME
 ************************************/
router.get("/get", async (req, res) => {
  const uid = req.query.firebase_uid;

  if (!uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("resume_data")
      .eq("firebase_uid", uid)
      .maybeSingle();

    const defaultResume = {
      name: "", title: "", email: "", phone: "",
      location: "", linkedin: "", summary: "",
      experience: [], education: [], skills: [],
      projects: []
    };

    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.json({ success: true, resume: data?.resume_data || defaultResume });

  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});


/************************************
 * 🔹 SAVE RESUME
 ************************************/
router.post("/save", async (req, res) => {
  const { firebase_uid, resume } = req.body;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });
  if (!resume) return res.status(400).json({ success: false, message: "resume is required" });

  try {
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(
        { firebase_uid, resume_data: resume, updated_at: new Date().toISOString() },
        { onConflict: "firebase_uid" }
      )
      .select("resume_data")
      .maybeSingle();

    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.json({ success: true, message: "Resume saved", resume: data?.resume_data || resume });

  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

/************************************
 * 🔹 UPDATE SECTION
 ************************************/
router.post("/update-section", async (req, res) => {
  const { firebase_uid, section, value } = req.body;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });
  if (!section) return res.status(400).json({ success: false, message: "section is required" });

  try {
    // First get existing resume
    const { data: existingData, error: fetchError } = await supabase
      .from("user_profiles")
      .select("resume_data")
      .eq("firebase_uid", firebase_uid)
      .maybeSingle();

    if (fetchError) throw fetchError;

    let resume = existingData?.resume_data || {};
    resume[section] = value;

    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(
        { firebase_uid, resume_data: resume, updated_at: new Date().toISOString() },
        { onConflict: "firebase_uid" }
      )
      .select("resume_data")
      .maybeSingle();

    if (error) return res.status(500).json({ success: false, error: error.message });

    return res.json({ success: true, message: "Section updated", resume: data?.resume_data });

  } catch (err) {
    return res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
