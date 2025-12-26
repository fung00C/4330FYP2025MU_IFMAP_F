import './styles/home.css';
import {useNavigate} from 'react-router-dom';
import myImage from './image/pngtree-outline-user-icon-png-image_1727916.jpg'

function Home() {
    const navigate = useNavigate();

    function bookmarkClick() {
        navigate("/bookmark")
    }

    function userClick() {
        navigate("/user")
    }

    return (
        <body>
            <div>
                <button className='round-button' onClick={userClick} img src={myImage}>
                    
                </button>
                <input type="text"/>
                <button className='round-button' onClick={bookmarkClick}>bookmark</button>
            </div>
            <div class="container">
                <div class="card">card 1</div>
                <div class="card">card 2</div>
                <div class="card">card 3</div>
                <div class="card">card 4</div>
                <div class="card">card 5</div>
            </div>
        </body>
    );
}

export default Home;