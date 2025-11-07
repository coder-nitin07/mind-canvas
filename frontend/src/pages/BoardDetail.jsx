import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';
import CreateNoteModal from '../components/CreateNoteModal';

const BoardDetail = () => {
    const { boardId } = useParams();
    const [ board, setBoard ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState('');
    const [ notes, setNotes ] = useState([]);
    const [ isModalOpen, setIsModalOpen ] = useState(false);

    //  fetch board details
    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:3000/board/${boardId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setBoard(response.data.board);
                setError('');


                // fetch notes of this Board
                const noteRes = await axios.get(
                    `http://localhost:3000/note/${boardId}/notes`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setNotes(noteRes.data.notes || []);
            } catch (err) {
                console.log('Error Fetching board : ', err);
                setError('Unable to fetch board details. Please try again.')
            } finally {
                setLoading(false);
            }
        };

        fetchBoardDetail();


        // const fetchNotes = async () => {
        //     try {
        //         const token = localStorage.getItem('token');

        //         const response = await axios.get(
        //             `http://localhost:3000/note/${boardId}/notes`,
        //             {
        //                 headers: { Authorization: `Bearer ${token}` }
        //             }
        //         );

        //         setNotes(response.data.notes || []);
        //     } catch (err) {
        //         console.log('Error Fetching notes : ', err);
        //         setNotes([]);
        //     }
        // };

        // fetchNotes();
    }, [boardId]);

    const handleCreateNote = async (newNote)=>{
        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                `http://localhost:3000/note/${boardId}/create`,
                newNote,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setNotes([ ...notes, response.data.note ]);
            setIsModalOpen(false);
        } catch (err) {
            console.log('Error while Creating Note ', err);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className='p-6 text-center text-gray-500'>Loading Board details...</div>
            </DashboardLayout>
        )
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className='p-6 text-red-500'>{error}</div>
            </DashboardLayout>
        )
    }

    if (!board) {
        return (
            <DashboardLayout>
                <div className='p-6 text-center text-gray-500'>
                    Board not found or you don't have access.
                </div>
            </DashboardLayout>
        )
    }
    return (
        <DashboardLayout>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className='text-3xl font-semibold text-gray-800'>{board.title}</h1>
                    <p className='text-gray-500 mt-2'>
                        {board.description || 'No description provided.'}
                    </p>

                    <p className='text-sm text-gray-400 mt-2'>
                        Created on {new Date(board.createdAt).toLocaleDateString()}
                    </p>
                </div>

                {/* Placeholder for features. */}
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
    <p className="text-gray-500 text-center">
      No notes yet. Create your first one!
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {note.title}
          </h3>
          <p className="text-gray-600">{note.content}</p>
          <p className="text-gray-400 text-sm mt-3">
            Created on {new Date(note.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )}
</div>

{/* Note Modal */}
<CreateNoteModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onCreate={handleCreateNote}
/>

            </div>
        </DashboardLayout>
    )
}

export default BoardDetail;