import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import { passWordListUpdate } from '../store/passwords/passwordslice';
import { Link } from 'react-router-dom';
import { setUpdateFormState } from '../store/passwords/updateFormSlice';
import { api } from '../App.jsx'
function Passwords() {
    const dispatch = useDispatch();
    const { user } = useUser();
    const [passArray, setPassArray] = useState([...JSON.parse(sessionStorage.getItem('myValue') ?? "[]")]);
    const { isSignedIn } = useAuth();


    useEffect(() => {
        handleGet();
    }, []);

    const handleGet = async () => {
        if (isSignedIn) {
            try {
                const response = await fetch(`${api}/getAllPasswords`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userAuthId: user.id })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                sessionStorage.setItem('myValue', JSON.stringify([...result]));
                setPassArray([...JSON.parse(sessionStorage.getItem('myValue') ?? "[]")]);
                dispatch(passWordListUpdate([...result]));
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const handleDelete = async (uniqueId) => {
        sessionStorage.setItem('myValue', JSON.stringify(passArray.filter((i) => i.uniqueId !== uniqueId)));
        setPassArray([...JSON.parse(sessionStorage.getItem('myValue') ?? "[]")]);
        if (isSignedIn) {
            try {
                const response = await fetch(`${api}/deletePassword`, {
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
                // console.log("result of deletion: ", result);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 sm:px-4 lg:px-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-center my-4">Your Passwords</h1>
            {passArray.length === 0 ? (
                <h2 className="text-center text-base sm:text-lg">No Passwords to show.</h2>
            ) : (
                <div className="overflow-x-auto w-full lg:w-3/4 xl:w-2/3 rounded-md">
                    <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg mx-auto">
                        <thead className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                            <tr>
                                <th className="p-2 sm:p-4 text-left text-xs sm:text-sm w-6">#</th>
                                <th className="p-2 sm:p-4 text-left text-xs sm:text-sm w-12 md:w-24">Actions</th>
                                <th className="p-2 sm:p-4 text-left text-xs sm:text-sm">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {passArray.map((password, index) => (
                                <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                    <td className="p-2 sm:p-4 text-xs sm:text-sm">{index + 1}</td>
                                    <td className="p-2 sm:p-4 text-xs sm:text-sm flex flex-col items-center space-y-2 w-full ">
                                        <button
                                            onClick={() => handleDelete(password.uniqueId)}
                                            className="bg-red-500 text-white rounded-lg px-1 sm:px-2 py-1 hover:bg-red-700 transition duration-300"
                                        >
                                            Delete
                                        </button>
                                        <Link to={'/'}>
                                            <button
                                                onClick={() => dispatch(setUpdateFormState(password))}
                                                className="bg-blue-500 text-white rounded-lg px-1 sm:px-2 py-1 hover:bg-blue-700 transition duration-300"
                                            >
                                                Update
                                            </button>
                                        </Link>
                                    </td>
                                    <td className="p-2 sm:p-4 text-xs sm:text-sm">
                                        <div className="mb-1 sm:mb-2">
                                            <span className="font-bold">Website URL:</span> <a href={password.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{password.websiteUrl}</a>
                                        </div>
                                        <div className="mb-1 sm:mb-2">
                                            <span className="font-bold">Username:</span> {password.username}
                                        </div>
                                        <div>
                                            <span className="font-bold">Password:</span> {password.password}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Passwords;
