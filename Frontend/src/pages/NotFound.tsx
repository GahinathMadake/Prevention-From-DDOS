import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
