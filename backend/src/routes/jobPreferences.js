import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/************************************
 * 1️⃣ GET JOB PREFERENCES
 * GET /api/job-preferences/get
 ************************************/
router.get("/get", async (req, res) => {
  const uid = req.firebase_uid;   // 🔥 secure authenticated UID

  const { data, error } = await supabase
    .from("job_preferences")
    .select("*")
    .eq("firebase_uid", uid)
    .single();

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, preferences: data || null });
});

/************************************
 * 2️⃣ SAVE / UPDATE JOB PREFERENCES
 * POST /api/job-preferences/save
 ************************************/
router.post("/save", async (req, res) => {
  const uid = req.firebase_uid;   // 🔥 secure

  const {
    profile_id = null,
    target_roles = [],
    locations = [],
    min_ctc = null,
    remote = false,
    full_time = true,
  } = req.body;

  const payload = {
    firebase_uid: uid,
    profile_id,
    target_roles,
    locations,
    min_ctc,
    remote,
    full_time,
  };

  const { data, error } = await supabase
    .from("job_preferences")
    .upsert(payload, { onConflict: "firebase_uid" })
    .select()
    .single();

  if (error) return res.status(500).json({ success: false, message: "Save failed", error: error.message });

  res.json({ success: true, preferences: data });
});

/************************************
 * 3️⃣ DELETE Preferences
 * DELETE /api/job-preferences/:id
 ************************************/
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("job_preferences").delete().eq("id", id);
  if (error) return res.status(500).json({ success: false, message: "Delete failed", error: error.message });

  res.json({ success: true, message: "Deleted" });
});

export default router;
