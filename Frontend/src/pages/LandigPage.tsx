import Navbar from '@/components/common/Navbar';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';



const LandingPage = () => {
  const {user} = useUser();

  const navigate = useNavigate();
  const handleStartDemo = () => {
    if(!user){
      alert("User not registerd!");
      return;
    }
    navigate('/demo');
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          🚫 DDoS Attack Prevention Demo
        </h1>

        <p className="text-lg md:text-xl text-gray-300 text-center max-w-xl mb-8">
          Discover how rate-limiting, authentication, and CAPTCHA can protect your app from distributed denial-of-service attacks.
        </p>

        <button
          onClick={handleStartDemo}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
        >
          Start Demo
        </button>

        <div className="mt-16 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} | Built for Web Security Awareness
        </div>
      </div>
    </div>
  )
}


export default LandingPage;