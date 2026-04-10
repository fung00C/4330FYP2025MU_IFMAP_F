import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeimage from '../image/home.png'
import '../styles/changepassword.css';


const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('access_token');

    const handleChangePassword = async () => {
        setMessage('');
        
        const response = await fetch('http://localhost:8000/changepassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage('Password changed successfully!');
            navigate("/login");
        } else {
            setMessage(data.detail || 'Failed to change password.');
        }
    };
    function homeClick(){
        navigate("/")
    }
    return (
        <div className="container">
            <div className="background"></div>
            <button className='homebutton' onClick={homeClick}><img src={homeimage} alt="" className='homeicon'/></button>
            <h1>Change Password</h1>
            <div className="inputs">
            <div className="input">
                <input
                    type="password"
                    placeholder="Old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
            </div>
            <div className="input">
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            <button onClick={handleChangePassword}>Change Password</button>
            </div>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default ChangePassword;