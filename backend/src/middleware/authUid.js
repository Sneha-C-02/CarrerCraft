module.exports = function (req, res, next) {
  const uid = req.headers["x-firebase-uid"];

  if (!uid) return res.status(401).json({ error: "Firebase UID missing" });

  req.firebase_uid = uid; // 🔥 forwarded to controllers
  next();
};
