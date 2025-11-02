import WorkspaceCard from '../components/WorkspaceCard';
import DashboardLayout from '../layouts/DashboardLayout'

const Workspace = () => {
  const workSpaces = [
      { id:1, name: 'Team Ideas Board',  createdAt: "2025-10-01" },
      { id: 2, name: "Design Sprint Notes", createdAt: "2025-09-22" },
  ];

  return (
    <DashboardLayout>
      <div className='p-6'>
          {/* header section */}
          <div className='flex items-center justify-between mb-6'>
            <h1 className='text-3xl font-semibold text-gray-700'>
              Your WorkSpaces
            </h1>

            <button className='bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition'>
              + Create WorkSpace 
            </button>
          </div>


          {/* WorkSpace List Section */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              { workSpaces.length === 0 ? (
                <p className='text-gray-500 col-span-full text-center'>
                  No workspaces yet. Create your first one!
                </p>
              ) : (
                workSpaces.map((ws) => (
                  <WorkspaceCard key={ws.id} name={ws.name} createdAt={ws.createdAt} />
                ))
              )}
          </div>
      </div>
    </DashboardLayout>
  )
}

export default Workspace