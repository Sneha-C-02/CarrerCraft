import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "CareerCraft Backend is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

export default router;
