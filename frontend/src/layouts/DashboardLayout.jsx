import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Section */}
      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;