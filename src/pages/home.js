import React, {useEffect, useState} from 'react';
import '../styles/home.css';
import {useNavigate} from 'react-router-dom';
import myImage from '../image/pngtree-outline-user-icon-png-image_1727916.jpg'

function Home() {
    const navigate = useNavigate();
    const [symbols, setSymbols] = useState([]);
    const [rawData, setRawData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getSymbol = (item) => {
        if (!item && item !== 0) return '';
        if (typeof item === 'string') return item;
        return item.symbol || item.ticker || item.name || JSON.stringify(item);
    }

    const extractSymbols = (payload) => {
        if (!payload) return [];
        let out = [];
        if (Array.isArray(payload)) {
            payload.forEach(p => { out.push(...extractSymbols(p)); });
            return out;
        }
        if (typeof payload === 'string') return [payload];
        if (typeof payload === 'object') {
            // If payload has top-level data array (as in the example)
            if (Array.isArray(payload.data)) return extractSymbols(payload.data);

            // If object maps sectors -> industries -> arrays
            Object.values(payload).forEach(v => {
                if (Array.isArray(v)) {
                    v.forEach(x => {
                        if (typeof x === 'string') out.push(x);
                        else out.push(...extractSymbols(x));
                    });
                } else if (typeof v === 'object') {
                    out.push(...extractSymbols(v));
                }
            });
        }
        return out;
    }

    function bookmarkClick() {
        navigate("/bookmark")
    }

    function userClick() {
        navigate("/user")
    }

    function symbolClick(symbol) {
        navigate(`/detail/${symbol}`)
    }

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:8000/category/stock')
            .then(res => res.json())
            .then(data => {
                setRawData(data);
                const found = extractSymbols(data);
                // dedupe and keep order
                const uniq = Array.from(new Set(found));
                setSymbols(uniq);
            })
            .catch(err => {
                console.error('Failed fetching stocks', err);
                setRawData(null);
                setSymbols([]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            <div>
                <button className='round-button' onClick={userClick} img src={myImage}>
                </button>
                <input type="text"/>
                <button className='round-button' onClick={bookmarkClick}>bookmark</button>

            </div>
            <div className="container">
                {loading && <div className='card'>Loading...</div>}
                {!loading && symbols.length === 0 && (
                    <div className='card'>No stocks available</div>
                )}
                {!loading && symbols.map((s, idx) => (
                    <div className='card' key={idx} onClick={() => symbolClick(s)} style={{cursor: 'pointer'}}>{getSymbol(s)}</div>
                ))}
            </div>

        </div>
    );
}

export default Home;
