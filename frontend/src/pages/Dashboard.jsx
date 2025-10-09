import Navbar from "../components/Navbar"

const Dashboard = () => {
  const userData = localStorage.getItem("user") || "User";
  const user = JSON.parse(userData);

  
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex flex-col items-center justify-center mt-20">
        <h2 className="text-3xl font-semibold mb-4">
          Welcome, { user.name }!
        </h2>
        <p className="text-gray-600">
          You are successfully logged in to MindCanvas.
        </p>
      </div>
    </div>
  )
}

export default Dashboard