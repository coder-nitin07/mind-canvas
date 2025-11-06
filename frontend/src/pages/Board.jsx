import { useLocation, useParams } from "react-router"
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import CreateBoardModal from "../components/CreateBoardModal";

const Board = () => {
  // Get Workspace ID
  const { id } = useParams();
  const location = useLocation();
  const workspaceName = location.state?.workspaceName || 'workspace';
  
  const [ boards, setBoards ] = useState([]);
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  // Fetch All Boards of WorkSpace
  useEffect(()=> {
      const fetchBoards = async () =>{
        try {
          const accessToken = localStorage.getItem('token');
          console.log('workspace id is  :  ', id)
          const response = await axios.get(
            `http://localhost:3000/board/${ id }/boards`,
            {
                headers: { Authorization: `Bearer ${ accessToken }` }
            }
          );

          setBoards(response.data.boards || []);
        } catch (err) {
          console.log('Error fetching Boards : ', err);
        }
      };

      fetchBoards();
  }, [ id ]);
  

   // ✅ Create new board handler
  const handleCreateBoard = async (newBoard) => {
    try {
      const accessToken = localStorage.getItem("token");
      console.log("id is ", id);
      const response = await axios.post(
         `http://localhost:3000/board/create/${id}`, 
        newBoard,
        {
          headers: { Authorization: `Bearer ${ accessToken }` },
        }
      );

      setBoards([ ...boards, response.data.board ]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };
  return (
    <DashboardLayout>
      <div className="p-6">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-700">
             { workspaceName } - Boards
          </h1>

          <button
            onClick={()=> setIsModalOpen(true) }
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          >
             + Create Board
          </button>
        </div>

        {/* Boards List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          { boards.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center">
              No boards yet. Create your first one!
            </p>
          ) : (
            boards.map((board) => (
              <div 
                key={ board.id }
                className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    { board.title }
                </h3>

                <p className="text-gray-500 text-sm">
                  Created on{" "}
                  {new Date(board.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          ) }
        </div>

        {/* Board Model */}
        <CreateBoardModal
          isOpen={ isModalOpen }
          onClose={() => setIsModalOpen(false)}
          onCreate={ handleCreateBoard }
        />
      </div>
    </DashboardLayout>
  )
}

export default Board;