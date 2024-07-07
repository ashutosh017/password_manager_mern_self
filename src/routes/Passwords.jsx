import React from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPasswords } from '../store/passwords/passwordslice';
import { Link } from 'react-router-dom';
import { setUpdateFormState } from '../store/passwords/updateFormSlice';

function Passwords() {
    const dispatch = useDispatch();
    // const passArray = useSelector(selectPasswords);
    const passArray = new Array();
    passArray.push(...JSON.parse(localStorage.getItem('myValue') ?? "[]"))
    console.log(passArray);
    const { isSignedIn } = useAuth();

    const handleDelete = async (uniqueId) => {
        if (isSignedIn)
            try {
                const response = await fetch('http://localhost:3000/deletePassword', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ uniqueId: uniqueId })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
            } catch (error) {
                console.error('Error:', error);
            }
    };

    return (
        <div className='bg-red-700 h-screen'>
            <div className=" mx-auto p-4 dark:bg-gray-900 ">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-700 dark:text-gray-300">Your Passwords</h1>
                {passArray.length == 0 ? <h2 className='text-white px-4 py-4'>No Passwords to show.</h2> :

                    <table className="w-full bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-800">
                        <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">

                            <tr>
                                <th className="p-4">#</th>
                                <th className="p-4">Actions</th>
                                <th className="p-4">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passArray.map((password, index) => (
                                <React.Fragment key={index}>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <td className="p-4 text-center text-gray-700 dark:text-gray-300">{index + 1}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(password.uniqueId)}
                                                className="bg-red-500 text-white rounded-full px-4 py-2 m-1 hover:bg-red-700 transition duration-300"
                                            >
                                                Delete
                                            </button>
                                            <Link to={'/'}>
                                                <button
                                                    onClick={() => dispatch(setUpdateFormState(password))}
                                                    className="bg-blue-500 text-white rounded-full px-4 py-2 m-1 hover:bg-blue-700 transition duration-300"
                                                >
                                                    Update
                                                </button>
                                            </Link>
                                        </td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">
                                            <div className="mb-2">
                                                <span className="font-bold">Website URL:</span> <a href={password.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{password.websiteUrl}</a>
                                            </div>
                                            <div className="mb-2">
                                                <span className="font-bold">Username:</span> {password.username}
                                            </div>
                                            <div>
                                                <span className="font-bold">Password:</span> {password.password}
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                }

            </div>
        </div>
    );
}

export default Passwords;
