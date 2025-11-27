// backend/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabaseClient.js";

// 🔥 ROUTES
import healthRoute from "./routes/health.js";
import profileRoute from "./routes/profile.js";
import skillsRoute from "./routes/skills.js";
import jobsRoute from "./routes/jobs.js";
import communityRoute from "./routes/community.js";
import resumeRoute from "./routes/resume.js";
import aiRoute from "./routes/ai.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

// DEBUG — Confirm All Routes Exist
console.log("ROUTES LOADED:", {
  health: !!healthRoute,
  profile: !!profileRoute,
  skills: !!skillsRoute,
  jobs: !!jobsRoute,
  community: !!communityRoute,
  resume: !!resumeRoute,
  ai: !!aiRoute,
});

// ------------------- ROUTES ---------------------
app.use("/api/health", healthRoute);
app.use("/api/profile", profileRoute);
app.use("/api/skills", skillsRoute);
app.use("/api/resume", resumeRoute);
app.use("/api/jobs", jobsRoute);
app.use("/api/community", communityRoute);
app.use("/api/ai", aiRoute);


// DEFAULT ROOT
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "CareerCraft Backend Running 🚀", port: PORT });
});

// 404 Handler
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found" }));

// SERVER START
app.listen(PORT, () => console.log(`🔥 Backend Live → http://localhost:${PORT}`));
