// import 'dotenv/config'
import { useEffect, useRef, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser, useAuth } from "@clerk/clerk-react";
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUpdateFormState, selectUpdateFormData, setUpdateFormState } from "./store/passwords/updateFormSlice";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// export const api = "http://localhost:3000"
export const api = "https://password-manager-mern-self-backend.onrender.com"

export default function App() {

  const dispatch = useDispatch();
  const updateFormData = useSelector(selectUpdateFormData);
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const passRef = useRef();
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    websiteUrl: '',
    username: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (updateFormData) {
      const { name, value } = updateFormData;
      setFormData({
        ...updateFormData,
        [name]: value,
      });
    }
  }, []);

  const showPassword = () => {
    if (show) {
      passRef.current.type = "password";
    }
    else {
      passRef.current.type = "text"
    }
    setShow(!show);

  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Password details submitted successfully")
    setFormData({
      websiteUrl: '',
      username: '',
      password: '',
    });
    try {
      const response = await fetch(`${api}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userAuthId: user.id, uniqueId: uuidv4() })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // const result = await response.json();
      // console.log('Form Data Submitted:', result);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    toast.success("Password details updated successfully", { onClose: () => navigate("/passwords"), })
    setFormData({
      websiteUrl: '',
      username: '',
      password: '',
    });
    dispatch(clearUpdateFormState(formData));
    if (isSignedIn) {
      try {
        const response = await fetch(`${api}/editPasswordDetails`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, userAuthId: user.id, uniqueId: updateFormData.uniqueId })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // const result = await response.json();
        // alert(result.msg);

        // navigate('/passwords');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="dark:bg-gray-900 h-screen flex flex-col items-center justify-center  ">
      <ToastContainer autoClose={1000} pauseOnHover={false} draggable={true} />
      <header className="px-4 h-14 flex items-center w-full bg-gray-800 text-white">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          {isSignedIn && (
            <div className="flex space-x-3 text-white">
              <UserButton />
              <div>{`Hello ${user.fullName}`}</div>
            </div>
          )}
        </SignedIn>
      </header>
      {/* <button className="text-white" onClick={notify} >click</button> */}
      <div className="flex flex-col items-center justify-center w-full flex-1 px-4 ">
        <div className="bg-gray-800 text-black p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-white text-2xl font-bold mb-5 text-center">{isSignedIn ? 'Submit your password details' : 'Please Sign in to continue'}</h2>
          <div className="mb-4">
            <label htmlFor="websiteUrl" className="block text-gray-100 font-semibold mb-2">
              Website URL
            </label>
            <input
              type="text"
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
            <div className="flex">
              <input
                ref={passRef}
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-500 border-r-0"
                required
              />
              <button onClick={showPassword} className="w-16 text-sm px-1 py-2 border border-gray-300 rounded-r-lg bg-gray-200 border-l-0 outline-none">{show ? `Hide` : `Show`}</button>
            </div>
          </div>
          <button
            disabled={!isSignedIn}
            onClick={updateFormData.uniqueId ? handleUpdate : handleSubmit}
            className="disabled:bg-gray-500 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-700"
          >
            {updateFormData.uniqueId ? 'Update Password Details' : 'Submit Password Details'}
          </button>
        </div>
        <button
          disabled={!isSignedIn}
          className="mt-4 px-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:bg-blue-700 disabled:bg-gray-500"
        >
          {isSignedIn ? (
            <Link to="/passwords">
              View Saved Passwords
            </Link>
          ) : (
            'View Saved Passwords'
          )}
        </button>
      </div>
    </div>
  );
}
