import React,{useState} from 'react'
import '../styles/LoginSignup.css'
import {useNavigate} from 'react-router-dom';
import email_icon from '../image/email.png'
import password_icon from '../image/password.png'
import homeimage from '../image/home.png'
import { Uselogin } from '../logincheck';
const LoginSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = Uselogin();
function Clicksignup(){
  navigate("/signup");
}
function homeClick(){
  navigate("/")
}
async function handleLogin() {
  setMessage('');
    const response = await fetch('http://localhost:8000/login', { // Adjust according to your backend port
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
 if (response.ok) {
            // Store the access token in local storage
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_email', email);

            login(); // Call the login function from Uselogin
            window.alert('Login successful!');
            navigate("/"); // Redirect to home page
        } else {
            window.alert(data.detail || 'Login failed. Please try again.'); // Provide a default message if none is provided
        }
  }

  return (
    <div className="container">
      <div className="background"></div>
      <button className='homebutton' onClick={homeClick}><img src={homeimage} alt="" className='homeicon'/></button>
        <div className="header">
            <div className="text">Login</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">           
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
        </div>
      <div className="submit-container">
        <div className="submit" onClick={Clicksignup}>Sign Up</div>
        <div className="submit" onClick={handleLogin}>Login</div>
      </div>
      {message && <div className="message">{message}</div>}
      <footer style={{textAlign:'center', padding:'12px', color:'#888'}}>
                    <p>@2025-2026 Yishu3 Intelligence Financial Market Analysis Platform</p>
                </footer>
    </div>
  )
}

export default LoginSignup