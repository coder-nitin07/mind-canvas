import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import DashboardLayout from '../layouts/DashboardLayout';

const BoardDetail = () => {
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notes, setNotes] = useState([]);

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
            } catch (err) {
                console.log('Error Fetching board : ', err);
                setError('Unable to fetch board details. Please try again.')
            } finally {
                setLoading(false);
            }
        };

        fetchBoardDetail();


        const fetchNotes = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(
                    `http://localhost:3000/note/${boardId}/notes`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                setNotes(response.data.notes || []);
            } catch (err) {
                console.log('Error Fetching notes : ', err);
                setNotes([]);
            }
        };

        fetchNotes();
    }, [boardId]);

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
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Notes</h2>

                    {notes.length === 0 ? (
                        <p className="text-gray-500">No notes yet. Create one!</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {notes.map(note => (
                                <div key={note.id} className="bg-yellow-100 p-4 rounded-xl shadow-sm">
                                    <h3 className="font-semibold text-gray-800">{note.title}</h3>
                                    <p className="text-gray-600 mt-1 text-sm">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default BoardDetail;