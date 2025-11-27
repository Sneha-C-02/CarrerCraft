import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/************************************
 * 1️⃣ GET ALL PROJECTS
 * GET /api/projects/get
 ************************************/
router.get("/get", async (req, res) => {
  const uid = req.firebase_uid;    // 🔥 secure

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("firebase_uid", uid)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, projects: data || [] });
});

/************************************
 * 2️⃣ ADD NEW PROJECT
 * POST /api/projects/add
 ************************************/
router.post("/add", async (req, res) => {
  const uid = req.firebase_uid;    // 🔥 secure

  const { profile_id, name, description = null, tech = null, link = null } = req.body;

  if (!name) return res.status(400).json({ success: false, message: "Project name required" });

  const payload = {
    firebase_uid: uid,
    profile_id: profile_id || null,
    name,
    description,
    tech,
    link,
  };

  const { data, error } = await supabase.from("projects").insert(payload).select().single();

  if (error) return res.status(500).json({ success: false, message: "Insert failed", error: error.message });

  res.json({ success: true, project: data });
});

/************************************
 * 3️⃣ UPDATE PROJECT
 * PUT /api/projects/:id
 ************************************/
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single();

  if (error) return res.status(500).json({ success: false, message: "Update failed", error: error.message });

  res.json({ success: true, project: data });
});

/************************************
 * 4️⃣ DELETE PROJECT
 ************************************/
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return res.status(500).json({ success: false, message: "Delete failed", error: error.message });

  res.json({ success: true, message: "Deleted" });
});

export default router;
