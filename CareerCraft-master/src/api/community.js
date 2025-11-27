import axios from "axios";
import { auth } from "../firebase/config";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getCurrentUID() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not signed in");
    return user.uid;
}

export const createPost = async (content) => {
    const firebase_uid = getCurrentUID();
    const res = await axios.post(`${API_URL}/community/post`, {
        firebase_uid,
        content,
    });
    return res.data;
};

export const getFeed = async () => {
    const res = await axios.get(`${API_URL}/community/feed`);
    return res.data;
};

export const addComment = async (post_id, comment) => {
    const firebase_uid = getCurrentUID();
    const res = await axios.post(`${API_URL}/community/comment`, {
        firebase_uid,
        post_id,
        comment,
    });
    return res.data;
};

export const likePost = async (post_id) => {
    const firebase_uid = getCurrentUID();
    const res = await axios.post(`${API_URL}/community/like`, {
        firebase_uid,
        post_id,
    });
    return res.data;
};
