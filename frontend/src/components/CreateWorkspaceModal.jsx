import { useState } from "react"

const CreateWorkspaceModal = ({ isOpen, onClose, onCreate }) => {
  const [ workSpaceName, setWorkSpaceName ] = useState('');
  const [ description, setDescription ] = useState('');

  // do not render if model is closed   
  if (!isOpen) return null;

  const handleSubmit = (e) =>{
        e.preventDefault();

        if(!workSpaceName.trim()){
            alert('WorkSpace name is required');
            return;
        }

        // send data to dashboard
        onCreate({ name: workSpaceName, description });
        setWorkSpaceName('');
        setDescription('');
        onClose();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Create New WorkSpace
            </h2>

            <form onSubmit={ handleSubmit } className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        WorkSpace Name
                    </label>

                    <input
                        type="text"
                        value={ workSpaceName }
                        onChange={(e)=> setWorkSpaceName(e.target.value) }
                        placeholder="Enter WorkSpace Name"
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                </div>


                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Description (optional)
                    </label>

                    <textarea
                        type="text"
                        value={ description }
                        onChange={(e)=> setDescription(e.target.value) }
                        placeholder="Write a short description..."
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button 
                        type="button" 
                        onClick={ onClose } 
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                    >
                        Create
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default CreateWorkspaceModal