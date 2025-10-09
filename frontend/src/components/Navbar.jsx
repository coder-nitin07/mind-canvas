import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className='flex items-center justify-between px-6 py-4 bg-gray-900 text-white'>
        <h1 className='text-xl font-semibold'>MindCanvas</h1>

        <button 
            onClick={ handleLogout }
            className='bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium'
        >
            Logout
        </button>
    </nav>
  )
}

export default Navbar