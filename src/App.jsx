import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from "@clerk/clerk-react";
import { v4 as uuidv4 } from 'uuid'
import { Link } from "react-router-dom";
export default function App() {

  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    websiteUrl: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    try {
      const response = await fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userAuthId: user.id, uniqueId: uuidv4() })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Form Data Submitted:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  };



  return (
    <div>
      <header className="mx-4 my-2">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          {isSignedIn &&
            <div className="flex space-x-3">  <UserButton /><div>{`Hello ${user.fullName}`}</div>
            </div>
          }
        </SignedIn>
      </header>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
        <form onSubmit={handleSubmit} className="bg-gray-800 text-black p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl text-white font-bold mb-5 text-center">{isSignedIn ? `Submit your password details` : `Please Sign in to continue`}</h2>
          <div className="mb-4">
            <label htmlFor="websiteUrl" className="block text-gray-100 font-semibold mb-2">
              Website URL
            </label>
            <input
              type="url"
              id="websiteUrl"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-100 font-semibold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-100 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
          >
            Submit
          </button>

        </form>
        <button
          className=""
        >
          <Link className="px-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-700" to={`/passwords`}>
            View Saved Passwords

          </Link>
        </button>
      </div>


    </div>
  )
}