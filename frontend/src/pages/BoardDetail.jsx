import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import CreateNoteModal from '../components/CreateNoteModal';
import EditNoteModal from '../components/EditNoteModal';
import { deleteNote } from '../api/noteApi';
import { io } from 'socket.io-client';

const BoardDetail = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const token = localStorage.getItem('token');

  // Socket state
  const [ socket, setSocket ] = useState(null);

  // Fetch board + notes
  const fetchBoardDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/board/${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoard(response.data.board);

      const noteRes = await axios.get(`http://localhost:3000/note/${boardId}/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(noteRes.data.notes || []);
    } catch (err) {
      console.log('Error Fetching board : ', err);
      setError('Unable to fetch board details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoardDetail();
  }, [boardId]);

  // Setup socket connection when BoardDetail mounts
  useEffect(() => {
    const s = io('http://localhost:3000', {
      auth: { token },
      query: { boardId }, // join board-specific room on server
    });
    setSocket(s);

    // listen for server events
    s.on('note_created', (newNote) => {
      setNotes((prev) => [...prev, newNote]);
    });

    s.on('note_updated', (updatedNote) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
      );
    });

    s.on('note_deleted', (deletedNoteId) => {
      setNotes((prev) => prev.filter((n) => n.id !== deletedNoteId));
    });

    // cleanup on unmount
    return () => {
      s.disconnect();
    };
  }, [boardId, token]);

  // Create Note
  const handleCreateNote = async (newNote) => {
    try {
      await axios.post(`http://localhost:3000/note/${boardId}/create`, newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsModalOpen(false);
      // No need to manually update notes — socket will handle it
    } catch (err) {
      console.log('Error while Creating Note ', err);
    }
  };

  // Edit Note
  const handleEdit = (note) => {
    setSelectedNote(note);
    setIsEditModalOpen(true);
  };

  // Delete Note
  const handleDelete = async (noteId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this note?');
    if (!confirmDelete) return;
    try {
      await deleteNote(noteId, token);
      // socket will update all clients automatically
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500">Loading Board details...</div>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <div className="p-6 text-red-500">{error}</div>
      </DashboardLayout>
    );

  if (!board)
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-500">
          Board not found or you don't have access.
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">{board.title}</h1>
          <p className="text-gray-500 mt-2">{board.description || 'No description provided.'}</p>
        </div>

        {/* Notes Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">Notes</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
            >
              + Add Note
            </button>
          </div>

          {notes.length === 0 ? (
            <p className="text-gray-500 text-center">No notes yet. Create your first one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="shadow-md rounded-xl p-5 hover:shadow-lg transition relative"
                  style={{ backgroundColor: note.color || '#ffffff' }}
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{note.title}</h3>
                  <p className="text-gray-600">{note.content}</p>
                  <p className="text-gray-400 text-sm mt-3">
                    Created on {new Date(note.createdAt).toLocaleDateString()}
                  </p>

                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <CreateNoteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateNote}
        />

        <EditNoteModal
          note={selectedNote}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onNoteUpdated={fetchBoardDetail}
          token={token}
        />
      </div>
    </DashboardLayout>
  );
};

export default BoardDetail;