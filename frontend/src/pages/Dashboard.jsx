import Navbar from "../components/Navbar";
import DashboardLayout from "../layouts/DashboardLayout";

const Dashboard = () => {
  const userData = localStorage.getItem("user") || "User";
  
  // parse user data
  const user = userData ? JSON.parse(userData) : { name: "User" };
  
  return (
     <DashboardLayout>
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Welcome, {user?.name || "User"} 👋
      </h1>
      <p className="text-gray-600">
        You’re logged in to <span className="text-teal-600 font-medium">MindCanvas</span> Dashboard.
      </p>
    </DashboardLayout>
  )
}

export default Dashboard