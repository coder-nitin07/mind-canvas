
const WorkspaceCard = ({ name, createdAt }) => {
  return (
    <div className="g-white shadow-md rounded-xl p-5 hover:shadow-lg transition">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{ name }</h3>

        <p className="text-gray-500 text-sm mb-4">
            Created on { new Date(createdAt).toLocaleDateString() }
        </p>

        <button className="bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition">
            Open
        </button>
    </div>
  )
}

export default WorkspaceCard;