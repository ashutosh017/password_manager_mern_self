import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from "@clerk/clerk-react";
import { v4 as uuidv4 } from 'uuid'
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { passWordListUpdate } from "./store/passwords/passwordslice";
import { selectUpdateFormData } from "./store/passwords/updateFormSlice";


export default function App() {
  const dispatch = useDispatch();
  const updateFormData = useSelector(selectUpdateFormData)
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    websiteUrl: '',
    username: '',
    password: '',
  });
  useEffect(() => {

    if (updateFormData) {
      const { name, value } = updateFormData;
      console.log("I am updating form data: ", updateFormData)
      setFormData({
        ...updateFormData,
        [name]: value,
      })
    }
  }, [])

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

  const handleGet = async () => {
    if (isSignedIn)
      try {
        const response = await fetch('http://localhost:3000/getAllPasswords', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uniqueId: user.id })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        localStorage.setItem('myValue', JSON.stringify([...result]));

        // console.log('handleGet called, list of all passwords:', result);
        dispatch(passWordListUpdate([...result]));
      } catch (error) {
        console.error('Error:', error);
      }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isSignedIn)
      try {
        const response = await fetch('http://localhost:3000/editPasswordDetails', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, userAuthId: user.id, uniqueId: updateFormData.uniqueId })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('all passwords:', result);
        // setPassArray([...result])
        // sessionStorage.setItem('myValue', JSON.stringify([...result]));
      } catch (error) {
        console.error('Error:', error);
      }
  }

  return (
    <div className="dark:bg-gray-900 text-white">
      <header className="px-4 h-14 flex items-center  ">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          {isSignedIn &&
            <div className="flex space-x-3 text-white ">  <UserButton /><div>{`Hello ${user.fullName}`}</div>
            </div>
          }
        </SignedIn>
      </header>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700">
        <form onSubmit={updateFormData.uniqueId ? handleUpdate : handleSubmit} className="dark:bg-gray-900 text-black p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl text-white font-bold mb-5 text-center">{isSignedIn ? `Submit your password details` : `Please Sign in to continue`}</h2>
          <div className="mb-4">
            <label htmlFor="websiteUrl" className="block text-gray-100 font-semibold mb-2">
              Website URL
            </label>
            <input
              type="url"
              id="websiteUrl"
              name="websiteUrl"
              // value={updateFormData.websiteUrl ?? formData.websiteUrl}
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
              // value={updateFormData.username ?? formData.username}
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
              // value={updateFormData.password ?? formData.password}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            disabled={!isSignedIn}
            type="submit"
            className="disabled:bg-gray-500 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
          >
            Submit
          </button>

        </form>
        <button
          disabled={!isSignedIn}
          onClick={handleGet}
          className="px-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-700 disabled:bg-gray-500"
        >
          {
            isSignedIn ?
              <Link to={`/passwords`} >
                View Saved Passwords
              </Link> : `View Saved Passwords`
          }

        </button>

      </div>


    </div>
  )
}