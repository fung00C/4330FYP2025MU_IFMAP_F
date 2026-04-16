import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import homeimage from '../image/home.png'
import '../styles/user.css';

const User = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
      const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('access_token');
        console.log('Fetching user data with token:', token);
            try {
                const response = await axios.get('http://localhost:8000/user', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEmail(response.data.email);
            } catch (err) {
                setError('Failed to fetch user data');
                console.error(err);
            }
        };
        const token = localStorage.getItem('access_token');
        if (token) {
            fetchUserData();
        } else {
            setError('No token found');
        }
        
    }, [token]);

    function handleChangePassword (){
        console.log("Change Password clicked");
        navigate("/changepassword");
    };
    function homeClick(){
        navigate("/")
    }
async function handleDeleteAccount() {
    console.log("Delete Account clicked");

    // Show confirmation dialog
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    
    if (!confirmDelete) {
        return;
    }

    try {
        // Send a DELETE request to the API to delete the account
        const response = await axios.delete('http://localhost:8000/delete', {
            headers: { Authorization: `Bearer ${token}` },  // Include bearer token for authentication
        });

        // Notify the user of successful deletion
        alert(response.data.message);

        // Optional: Clear the token and redirect the user
        localStorage.removeItem('access_token'); // Clear the token
        navigate("/login"); // Redirect to the login page or home page after deletion
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('An error occurred while trying to delete your account.'); // Error message to the user
    }
    try {
        const response = await fetch(`http://localhost:8000/bookmarks/delete_notification_setting?email=${email}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error deleting notification setting:', error);
    }
    try {
        const response = await fetch(`http://localhost:8000/bookmarks/remove_all?email=${email}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error removing all bookmarks:', error);
    }
}

    return (
        <div className="container">
            <div className="background"></div>
            <h1 className="title">User Page</h1>
            <button className='homebutton' onClick={homeClick}><img src={homeimage} alt="" className='homeicon'/></button>
            <div className="contentwrapper">
            <h1>Welcome to User Page</h1>
            {error ? (
                <p className="error-message">{error}</p>
            ) : (
                email && <p className="user-email">Your Email: {email}</p>
            )}
            <div className="button-container">
                <button className="button" onClick={handleChangePassword}>Change Password</button>
                <button className="button" onClick={handleDeleteAccount}>Delete Account</button>
            </div>
            </div>
            <footer style={{textAlign:'center', padding:'12px', color:'#888'}}>
                    <p>@2025-2026 Yishu3 Intelligence Financial Market Analysis Platform</p>
                </footer>
        </div>
    );
};

export default User;