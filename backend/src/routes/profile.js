import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/************************************
 * 1️⃣ CREATE / UPDATE PROFILE
 ************************************/
router.post("/create", async (req, res) => {
  const { firebase_uid, name, email } = req.body;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert({ firebase_uid, name, email }, { onConflict: "firebase_uid" })
    .select();

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ success: true, profile: data[0], message: "Profile saved ✔" });
});


/************************************
 * 2️⃣ SAVE FULL RESUME
 ************************************/
router.post("/save-resume", async (req, res) => {
  const { firebase_uid, resume_data } = req.body;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });

  const { data, error } = await supabase
    .from("user_profiles")
    .update({ resume_data, updated_at: new Date() })
    .eq("firebase_uid", firebase_uid)
    .select();

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ success: true, message: "Resume saved ✔", profile: data[0] });
});


/************************************
 * 3️⃣ GET PROFILE
 ************************************/
router.get("/get", async (req, res) => {
  const { firebase_uid } = req.query;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });

  const { data, error } = await supabase
    .from("user_profiles")
    .select("firebase_uid, name, email, resume_data, skills, created_at, updated_at")
    .eq("firebase_uid", firebase_uid)
    .single();

  if (error) return res.status(500).json({ success: false, message: error.message });

  res.json({ success: true, profile: data });
});

export default router;
