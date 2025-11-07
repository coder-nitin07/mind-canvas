import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const updateNote = async (noteId, noteData, token) => {
    const res = await axios.put(`${ API_URL }/note/${ noteId }`, noteData, {
        headers: { Authorization: `Bearer ${ token }` }
    });

    return res.data;
};

export const deleteNote = async (noteId, token) => {
    const res = await axios.delete(`${ API_URL }/note/${ noteId }`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    
    return res.data;
};