import { useState } from 'react';
import CreateWorkspaceModal from '../components/CreateWorkspaceModal';
import WorkspaceCard from '../components/WorkspaceCard';
import DashboardLayout from '../layouts/DashboardLayout'
import { useEffect } from 'react';
import axios from "axios";

const Workspace = () => {
  const [ workspaces, setWorkspaces ] =  useState([]);
  const [ isModalOpen, setIsModalOpen ] = useState(false);
  console.log("first", "Ssss")

 useEffect(() => {
  const fetchWorkSpace = async () => {
    try {
      const accessToken = localStorage.getItem('token');
      // if (!accessToken) {
      //   console.log('No access token found');
      //   return;
      // }

      const response = await axios.get('http://localhost:3000/workSpace/getUserWorkSpace', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      console.log(response, "s");
      setWorkspaces(response.data.workSpace || []);


    } catch (err) {
      console.log('Error Fetching Workspaces:', err);
    }
  };

  fetchWorkSpace();
 }, []);

  const handleCreateWorkSpace = async (newWorkSpace) => {
    console.log("first")
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/workSpace/create",
        newWorkSpace,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add new workspace to UI instantly
      setWorkspaces([...workspaces, response.data.data ]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };
  return (
    <DashboardLayout>
      <div className='p-6'>
          {/* header section */}
          <div className='flex items-center justify-between mb-6'>
            <h1 className='text-3xl font-semibold text-gray-700'>
              Your WorkSpaces
            </h1>

            <button 
              onClick={()=> setIsModalOpen(true) }
              className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition'
            >
              + Create WorkSpace 
            </button>
          </div>


          {/* WorkSpace List Section */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              { workspaces.length === 0 ? (
                <p className='text-gray-500 col-span-full text-center'>
                  No workspaces yet. Create your first one!
                </p>
              ) : (
                workspaces.map((ws) => (
                  <WorkspaceCard key={ws.id} name={ws.name} createdAt={ws.createdAt} />
                ))
              ) }
          </div>

          {/* Model */}
          <CreateWorkspaceModal 
              isOpen={ isModalOpen }
              onClose={()=> setIsModalOpen(false) }
              onCreate={ handleCreateWorkSpace }
          />
      </div>
    </DashboardLayout>
  )
}

export default Workspace;