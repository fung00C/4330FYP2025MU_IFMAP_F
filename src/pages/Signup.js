import React,{useState} from 'react'
import '../styles/Signup.css'
import email_icon from '../image/email.png'
import password_icon from '../image/password.png'
import homeimage from '../image/home.png'
import {useNavigate} from 'react-router-dom';
const LoginSignup = () => {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [message,setMessage]=useState('');
  const navigate = useNavigate();
function ClickLogin(){
  navigate("/login");
}
function homeClick(){
  navigate("/")
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
      //setMessage(data.message); // Display success message
      window.alert(data.message);
      navigate("/login");
// Optionally navigate or reset fields
    } else {
      // Handle registration error, such as email already taken
      window.alert(data.detail);
    }
    } catch(error){
      window.alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="container">
      <div className="background"></div>
        <button className='homebutton' onClick={homeClick}><img src={homeimage} alt="" className='homeicon'/></button>
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
      {message && <p className="message">{message}</p>}
      <footer style={{textAlign:'center', padding:'12px', color:'#888'}}>
                    <p>@2025-2026 Yishu3 Intelligence Financial Market Analysis Platform</p>
                </footer>
    </div>
  )
}

export default LoginSignup