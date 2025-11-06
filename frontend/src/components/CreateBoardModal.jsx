import { useState } from "react";

const CreateBoardModal = ({ isOpen, onClose, onCreate }) => {
  const [ boardData, setBoardData ] = useState({
    title: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setBoardData({
      ...boardData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!boardData.title.trim()) {
      alert("Board name is required");
      return;
    }

    onCreate(boardData);
    setBoardData({ title: "", description: "" });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Create New Board
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Board Name */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Board Name
            </label>
            <input
              type="text"
              name="title"
              value={ boardData.title }
              onChange={ (e)=> setBoardData({ ...boardData, title: e.target.value }) }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Enter board name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={boardData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="Optional description..."
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-400 text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;