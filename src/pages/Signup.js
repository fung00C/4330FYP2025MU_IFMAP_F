import React,{useState} from 'react'
import '../styles/Signup.css'
import email_icon from '../image/email.png'
import password_icon from '../image/password.png'
import {useNavigate} from 'react-router-dom';
const LoginSignup = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [message,setMessage]=useState('');
  const navigate = useNavigate();
function ClickLogin(){
  navigate("/login");
}
  const handleSubmit= async(e)=>{
    e.preventDefault();
    setMessage('');
    try{
      const response= await fetch('http://localhost:8000/signup',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({email,password}),
  });
      const data= await response.json();
if (response.ok) {
      setMessage(data.message); // Display success message
      // Optionally navigate or reset fields
    } else {
      // Handle registration error, such as email already taken
      setMessage(data.detail);
    }
    } catch(error){
      setMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container">
        <div className="header">
            <div className="text">Signup</div>
            <div className="underline"></div>
        </div>
        <form onSubmit={handleSubmit}>
        <div className="inputs">         
            <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}
                required/>
            </div>
            <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}
                required/>
            </div>
        </div>
        
      <div className="submit-container">
        <button type="submit" className="submit">Sign Up</button>
        <button type="submit" className="submit" onClick={ClickLogin}>Login</button>
      </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default LoginSignup