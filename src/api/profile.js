import axios from "axios";
import { auth } from "../firebase/config";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function getCurrentUID() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not signed in");
    return user.uid;
}

export const createProfile = async (name, email) => {
    const firebase_uid = getCurrentUID();
    const res = await axios.post(`${API_URL}/profile/create`, {
        firebase_uid,
        name,
        email,
    });
    return res.data;
};

export const getProfile = async () => {
    const firebase_uid = getCurrentUID();
    const res = await axios.get(`${API_URL}/profile/get`, {
        params: { firebase_uid },
    });
    return res.data;
};
