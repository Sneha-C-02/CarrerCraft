import axios from "axios";
import { auth } from "../firebase/config";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getCurrentUID() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not signed in");
    return user.uid;
}

export const suggestJobs = async (skills) => {
    const res = await axios.post(`${API_URL}/jobs/suggest`, {
        skills,
    });
    return res.data;
};

export const matchJob = async (resume, job) => {
    const res = await axios.post(`${API_URL}/jobs/match`, {
        resume,
        job,
    });
    return res.data;
};

export const addJobHistory = async (job_title) => {
    const firebase_uid = getCurrentUID();
    const res = await axios.post(`${API_URL}/jobs/history/add`, {
        firebase_uid,
        job_title,
    });
    return res.data;
};

export const getJobHistory = async () => {
    const firebase_uid = getCurrentUID();
    const res = await axios.get(`${API_URL}/jobs/history`, {
        params: { firebase_uid },
    });
    return res.data;
};
