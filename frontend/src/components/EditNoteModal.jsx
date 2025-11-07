import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { updateNote } from "../api/noteApi";

const EditNoteModal = ({ note, isOpen, onClose, onNoteUpdated, token }) => {
  const [ formData, setFormData ] = useState({ title: "", content: "", color: "#ffffff" });
  const [ loading, setLoading ] = useState(false);

  useEffect(() => {
    if (note) setFormData({ 
        title: note.title || '', 
        content: note.content || '', 
        color: note.color || "#ffffff" 
    });
  }, [ note ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [ e.target.name ]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await updateNote(note.id, formData, token);
      onNoteUpdated(); // refresh list
      onClose();
    } catch (err) {
      console.error("Error updating note:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-[#1E1E1E] p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Edit Note</h2>
        <form onSubmit={ handleSubmit } className="space-y-4">
          <input
            name="title"
            value={ formData.title || '' }
            onChange={ handleChange }
            placeholder="Title"
            className="w-full border p-2 rounded-lg bg-transparent"
            required
          />

          <textarea
            name="content"
            value={ formData.content || '' }
            onChange={ handleChange }
            placeholder="Content"
            className="w-full border p-2 rounded-lg bg-transparent h-24"
            required
          />
          <input
            type="color"
            name="color"
            value={ formData.color || '#fff' }
            onChange={ handleChange }
            className="w-16 h-10 cursor-pointer"
          />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg">
              Cancel
            </button>

            <button
              type="submit"
              disabled={ loading }
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg"
            >
              { loading ? "Updating..." : "Update" }
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditNoteModal;