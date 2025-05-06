import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '@/context/UserContext';
import Navbar from '@/components/common/Navbar';

const ContactForm: React.FC = () => {
  
  const {user} = useUser();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(!user){
      alert("please logging First");
      return;
    }

    setIsSubmitting(true);
    setStatus('');

    try {
      const res = await axios.post('http://localhost:5000/api/help', {
        name,
        email,
        message,
      },
      {
        withCredentials: true,
      }
    );

      console.log(res);

      alert("Form submission Successfully!");
      setStatus(res.data.message);
      setName('');
      setEmail('');
      setMessage('');
    } 
    catch (err: any) {
        alert(err.response?.data?.message || "Something Went Wrong");
      setStatus(err.response?.data?.message || 'Submission failed');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
     <Navbar/>
     <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Contact Us</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your message here..."
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Send Message'}
          </button>
        </form>
        {status && (
          <p className={`mt-4 text-center text-sm font-medium ${status.includes('success') || status.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
            {status}
          </p>
        )}
      </div>
    </div>
    </>
  );
};

export default ContactForm;
