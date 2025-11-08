import { useState } from "react"

const CreateNoteModal = ({ isOpen, onClose, onCreate }) => {
  const [ noteData, setNoteData ] = useState({
    title: '',
    content: ''
  });

  if(!isOpen) return null;

  const handleChange = (e) =>{
    setNoteData({ ...noteData, [ e.target.name ]: e.target.value });
  };

  const handleSubmit = (e) =>{
    e.preventDefault();

    if(!noteData.title.trim()){
        alert('Note title is required');
        return;
    }

    if(!noteData.content.trim()){
        alert('Note content is required');
        return;
    }

    onCreate(noteData);
    setNoteData({ title: '', content: '' });
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Create a New Note
            </h2>

            <form onSubmit={ handleSubmit }>
                <div className="mb-3">
                    <label className="block text-gray-600 mb-1">Title</label>

                    <input
                        type="text"
                        name="title"
                        value={ noteData.title }
                        onChange={ handleChange }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Enter note title"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-gray-600 mb-1">Content</label>
                    <textarea
                        name="content"
                        value={noteData.content}
                        onChange={handleChange}
                        rows="4"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        placeholder="Write your note..."
                    ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={ onClose }
                        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateNoteModal;