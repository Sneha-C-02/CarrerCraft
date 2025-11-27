import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/***********************************
 * 1️⃣ CREATE POST
 ***********************************/
router.post("/post", async (req, res) => {
  const { firebase_uid, content } = req.body;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });
  if (!content) return res.status(400).json({ success: false, message: "content required" });

  const { data, error } = await supabase
    .from("community_posts")
    .insert([{ firebase_uid, content }])
    .select();

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, post: data[0] });
});


/***********************************
 * 2️⃣ GET FEED + COMMENTS
 ***********************************/
router.get("/feed", async (req, res) => {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*, community_comments(*)")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, feed: data });
});


/***********************************
 * 3️⃣ ADD COMMENT
 ***********************************/
router.post("/comment", async (req, res) => {
  const { firebase_uid, post_id, comment } = req.body;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });
  if (!post_id || !comment) return res.status(400).json({ success: false, message: "post_id + comment needed" });

  const { data, error } = await supabase
    .from("community_comments")
    .insert([{ firebase_uid, post_id, comment }])
    .select();

  if (error) return res.status(500).json({ success: false, error: error.message });

  res.json({ success: true, comment: data[0] });
});


/***********************************
 * 4️⃣ LIKE POST (no duplicates)
 ***********************************/
router.post("/like", async (req, res) => {
  const { firebase_uid, post_id } = req.body;

  if (!firebase_uid) return res.status(400).json({ success: false, message: "firebase_uid is required" });
  if (!post_id) return res.status(400).json({ success: false, message: "post_id required" });

  const { data: existing } = await supabase
    .from("community_likes")
    .select("*")
    .eq("firebase_uid", firebase_uid)
    .eq("post_id", post_id)
    .maybeSingle();

  if (existing) return res.json({ success: true, alreadyLiked: true });

  const { error } = await supabase.from("community_likes").insert([{ firebase_uid, post_id }]);

  if (error) return res.status(500).json({ success: false, error: error.message });

  await supabase.rpc("increment_post_likes", { x: post_id });

  res.json({ success: true, message: "Post liked!" });
});

export default router;
