import React, { useEffect, useState, useRef } from "react";
import {
  MessageSquare,
  Heart,
  Send,
  UserCircle2,
  Moon,
  Sun,
  Zap,
  X,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPost, getFeed, addComment, likePost } from "../api/community";
import { auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

/**
 * Community.jsx
 * - Post composer with subtle glow + animations
 * - Like toggle with bump effect
 * - Slide-in comment panel (mock threads)
 * - AI reply suggestion chip (random suggestions)
 * - Dark mode toggle (persists to localStorage)
 * - Posts & comments persist to Backend
 */

const THEME_KEY = "careercraft_theme";

const sampleSuggestions = [
  "Amazing work — would love to see the repo!",
  "Nice UI — try adding a small microinteraction.",
  "Love this — can you share the tech stack?",
];

function initials(name = "User") {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function avatarColor(seed = "") {
  // deterministic color out of a few choices
  const palette = [
    "bg-gradient-to-br from-indigo-400 to-indigo-600",
    "bg-gradient-to-br from-pink-400 to-pink-600",
    "bg-gradient-to-br from-emerald-400 to-emerald-600",
    "bg-gradient-to-br from-yellow-400 to-orange-500",
    "bg-gradient-to-br from-sky-400 to-blue-600",
  ];
  const n = Array.from(seed).reduce((s, c) => s + c.charCodeAt(0), 0);
  return palette[n % palette.length];
}

export default function Community() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(THEME_KEY) === "dark"
  );
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [openCommentsFor, setOpenCommentsFor] = useState(null); // post id
  const [commentText, setCommentText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [user] = useAuthState(auth);

  const composerRef = useRef(null);

  // load posts from API
  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await getFeed();
        if (data.feed) {
          // Map backend fields to UI fields if necessary
          // Backend: content, firebase_uid, id, created_at
          // UI expects: name, role, content, likes, likedByMe, comments
          // We might need to enrich this data or adjust UI.
          // For now, let's assume backend returns what we need or we map it.
          // Since backend is simple, we might need to mock name/role if not in DB.
          const mapped = data.feed.map(p => ({
            ...p,
            name: "User " + p.firebase_uid.slice(0, 4), // Mock name
            role: "Member",
            likes: p.community_likes?.length || 0, // Backend returns array of likes
            likedByMe: p.community_likes?.includes(user?.uid) || false, // Check if current user liked
            comments: p.community_comments || []
          }));
          setPosts(mapped);
        }
      } catch (err) {
        console.error("Failed to load feed", err);
      }
    }
    loadPosts();
  }, [user]); // Re-run when user changes to update likedByMe

  // persist theme
  useEffect(() => {
    localStorage.setItem(THEME_KEY, darkMode ? "dark" : "light");
  }, [darkMode]);

  // composer submit
  const handlePost = async () => {
    if (!user) return alert("Please login to post");
    const body = newPost.trim();
    if (!body) return;

    try {
      const { post } = await createPost(body);
      // Optimistic update or re-fetch
      const newEntry = {
        ...post,
        name: "You",
        role: "CareerCrafter",
        likes: 0,
        likedByMe: false,
        comments: [],
        createdAt: new Date().toISOString()
      };
      setPosts((p) => [newEntry, ...p]);
      setNewPost("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      alert("Failed to post");
    }
  };

  // like toggle
  const handleToggleLike = async (id) => {
    if (!user) return alert("Please login to like");
    try {
      await likePost(id);
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === id) {
            const newLikedByMe = !post.likedByMe;
            const newLikes = newLikedByMe ? post.likes + 1 : Math.max(0, post.likes - 1);
            return {
              ...post,
              likedByMe: newLikedByMe,
              likes: newLikes,
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error(err);
      alert("Failed to like/unlike post");
    }
  };

  // open comment drawer
  const openComments = (postId) => {
    setOpenCommentsFor(postId);
    setCommentText("");
    setTimeout(() => {
      const el = document.getElementById("comment-input");
      if (el) el.focus();
    }, 120);
  };

  // add comment
  const handleAddComment = async (postId) => {
    if (!user) return alert("Please login to comment");
    const txt = commentText.trim();
    if (!txt) return;

    try {
      const { comment } = await addComment(postId, txt);
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: [
                ...(post.comments || []),
                { ...comment, name: "You", text: txt, createdAt: new Date().toISOString() },
              ],
            }
            : post
        )
      );
      setCommentText("");
    } catch (err) {
      console.error(err);
      alert("Failed to comment");
    }
  };

  // AI suggested reply (mock)
  const handleAiSuggest = async () => {
    setAiLoading(true);
    await new Promise((res) => setTimeout(res, 800));
    const suggestion =
      sampleSuggestions[Math.floor(Math.random() * sampleSuggestions.length)];
    setAiLoading(false);
    setCommentText(suggestion);
  };

  // styles
  const bg = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-100"
    : "bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900";

  return (
    <div className={`${bg} min-h-screen py-10 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Peer Community</h1>
            <p className="text-sm text-gray-500">
              Share wins, ask for feedback, and help peers grow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode((d) => !d)}
              className={`p-2 rounded-lg border ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                }`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Composer */}
        <motion.div
          ref={composerRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white/80 ${darkMode ? "bg-gray-800/60" : ""} p-4 rounded-xl shadow-md border border-gray-100 mb-6`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${avatarColor("You")}`}>
              {initials("You")}
            </div>

            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Share a quick update, ask for feedback, or post a win..."
                rows={3}
                className="w-full resize-none bg-transparent outline-none text-gray-800 placeholder-gray-400 dark:placeholder-gray-300 dark:text-gray-100"
                aria-label="Create post"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // quick AI suggestion to help write
                      setAiLoading(true);
                      setTimeout(() => {
                        setAiLoading(false);
                        setNewPost((prev) =>
                          prev
                            ? prev + " — " + sampleSuggestions[Math.floor(Math.random() * sampleSuggestions.length)]
                            : sampleSuggestions[Math.floor(Math.random() * sampleSuggestions.length)]
                        );
                      }, 700);
                    }}
                    className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-md bg-gradient-to-r from-white/60 to-white/30 border hover:brightness-95 transition"
                    title="AI writing helper"
                  >
                    <Zap className="w-4 h-4 text-yellow-500" />
                    AI Suggest
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePost}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <Send className="w-4 h-4" />
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feed */}
        <div className="space-y-5">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className={`rounded-2xl p-5 shadow-md border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} hover:shadow-lg transition`}
              >
                <header className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${avatarColor(post.name)}`}>
                      {initials(post.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{post.name}</h3>
                      <p className="text-sm text-gray-500">{post.role}</p>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">{timeAgo(post.createdAt)}</div>
                </header>

                <p className="mt-4 text-gray-700 dark:text-gray-200">{post.content}</p>

                <footer className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleLike(post.id)}
                      className="flex items-center gap-2 text-sm"
                      aria-pressed={post.likedByMe ? "true" : "false"}
                    >
                      <motion.span
                        animate={{ scale: post.likedByMe ? [1, 1.15, 1] : 1 }}
                        transition={{ duration: 0.28 }}
                        className={`${post.likedByMe ? "text-rose-500" : "text-gray-500"}`}
                      >
                        <Heart className="w-5 h-5" />
                      </motion.span>
                      <span className="text-sm">{post.likes} Likes</span>
                    </motion.button>

                    <button
                      onClick={() => openComments(post.id)}
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {post.comments?.length || 0} Comments
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        // quick share: copy to clipboard (simple UX)
                        navigator.clipboard?.writeText(window.location.href + `#post-${post.id}`);
                        toast("Link copied to clipboard");
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Share
                    </button>

                    <button
                      onClick={() => {
                        // small quick reply that opens comments and prefill with AI suggestion
                        openComments(post.id);
                        handleAiSuggest();
                      }}
                      className="text-sm px-3 py-1 rounded-md bg-white/50 border hover:bg-white/60 transition"
                    >
                      Quick Reply
                    </button>
                  </div>
                </footer>
              </motion.article>
            ))}
          </AnimatePresence>

          {posts.length === 0 && (
            <div className="text-center text-gray-500 py-10">No posts yet — be the first to post!</div>
          )}
        </div>
      </div>

      {/* Comment drawer / panel */}
      <AnimatePresence>
        {openCommentsFor && (
          <motion.aside
            key="comment-panel"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className={`fixed right-0 top-0 h-full w-full sm:w-96 p-4 z-50 ${darkMode ? "bg-gray-900/80" : "bg-white/95"
              } border-l`}
          >
            <div className="max-w-md mx-auto h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Comments</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setOpenCommentsFor(null);
                      setCommentText("");
                    }}
                    className="p-2 rounded-md"
                  >
                    <X />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto space-y-3 mb-4">
                {(posts.find((p) => p.id === openCommentsFor)?.comments || []).map(
                  (c) => (
                    <div
                      key={c.id}
                      className={`p-3 rounded-lg ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} shadow-sm`}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${avatarColor(c.name)}`}>
                          {initials(c.name)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{c.name}</div>
                          <div className="text-xs text-gray-400">{timeAgo(c.createdAt)}</div>
                        </div>
                      </div>
                      <div className="text-sm">{c.text}</div>
                    </div>
                  )
                )}
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2">
                  <input
                    id="comment-input"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a supportive reply..."
                    className="flex-1 border rounded-lg p-3 outline-none bg-transparent"
                  />
                  <button
                    onClick={() => handleAiSuggest()}
                    title="AI suggest reply"
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-white/60 to-white/30 border"
                  >
                    {aiLoading ? "..." : "AI"}
                  </button>
                  <button
                    onClick={() => handleAddComment(openCommentsFor)}
                    className="px-3 py-2 rounded-lg bg-blue-600 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-2 flex gap-2">
                  {/* quick chips */}
                  {sampleSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setCommentText(s)}
                      className="text-xs px-3 py-1 rounded-full border bg-white/40"
                    >
                      {s.slice(0, 28)}{s.length > 28 ? "…" : ""}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

/* small helpers */
function timeAgo(ts) {
  if (!ts) return "";
  const date = new Date(ts);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* tiny toast fallback (non-blocking) */
function toast(msg) {
  // simple ephemeral floating toast
  const el = document.createElement("div");
  el.textContent = msg;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(0,0,0,0.8)",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    zIndex: 99999,
    fontSize: "13px",
  });
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}
