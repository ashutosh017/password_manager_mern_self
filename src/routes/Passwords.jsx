import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react';
import { useSelector } from 'react-redux';
import { selectPasswords } from '../store/passwords/passwordslice';




function Passwords() {
    // const [passArray, setPassArray] = useState([]);
    const passArray = useSelector(selectPasswords)

    const { isSignedIn } = useAuth();
    const { user } = useUser();

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
                console.log('all passwords:', result);
                setPassArray([...result])
                sessionStorage.setItem('myValue', JSON.stringify([...result]));
            } catch (error) {
                console.error('Error:', error);
            }
    }
    useEffect(() => {
        setTimeout(() => {
            console.log("useeffect ran after 3 secs")
        }, 3000);

        // (() => { handleGet(); console.log("iife invoked") })()

        handleGet();

    }, [])

    const func = () => setTemp(temp + 1);

    return (
        <div>
            <h1>Your Passwords</h1>
            {/* {passArray.length} */}
            <table className='border w-full'>
                <tbody className='w-full'>
                    {passArray.length > 0 && passArray.map((password, index) => (
                        <React.Fragment key={index}>
                            <tr className='border-b bg-orange-300 '>
                                <td>{index + 1}</td>
                                <td><button onClick={() => handleDelete(password.uniqueId)} className='bg-gray-50 rounded-lg px-2 hover:bg-yellow-300'>delete</button></td>
                                <td><button className='bg-gray-50 rounded-lg px-2 hover:bg-yellow-300'>update</button></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>Website URL</td>
                                <td>{password.websiteUrl}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>Username</td>
                                <td>{password.username}</td>
                            </tr>
                            <tr className='border-b'>
                                <td></td>
                                <td>Password</td>
                                <td>{password.password}</td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default Passwords