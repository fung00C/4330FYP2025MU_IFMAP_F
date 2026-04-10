import React, {use, useEffect, useState} from 'react';
import '../styles/home.css';
import {useNavigate} from 'react-router-dom';
import myImage from '../image/user.png'
import bookmarkimage from '../image/bookmark.png'
import downimage from '../image/arrow-down.png'
import { Uselogin } from '../logincheck';
import axios from 'axios';

function Home() {
    const navigate = useNavigate();
    const [symbols, setSymbols] = useState([]);
    const [rawData, setRawData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [prices, setPrices] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [longName, setLongName] = useState({});
    const [shortName, setShortName] = useState({});
    const [IncreaseDecrease, setIncreaseDecrease] = useState({});
    const [recommendation, setRecommendation] = useState({});

    const [sectorMap, setSectorMap] = useState({});
    const [sectors, setSectors] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState(''); 
    const [symbolInfo, setSymbolInfo] = useState({}); 
    const { islogin } = Uselogin();
    const [bookmarkedSymbols, setBookmarkedSymbols] = useState([]);

    const email = localStorage.getItem('user_email');
    const [bookmarks, setBookmarks] = useState([]);


    useEffect(() => {
        if (!email) return;
        fetch(`http://localhost:8000/bookmarks/get?email=${email}`)
            .then(res => res.json())
            .then(data => {
                setBookmarks(data.data || []);
            })
            .catch(err => console.error('Failed to fetch bookmarks:', err));
    }, [email]);

    useEffect(() => {
        if (symbols.length === 0) return;
        symbols.forEach(symbol => {
            fetch(`http://localhost:8000/recommendation/stock?symbol=${symbol}`)
                .then(res => res.json())
                .then(data => {
                    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                        setRecommendation(prev => ({
                            ...prev,
                            [symbol]: data.data[0].recommendation
                        }));
                    }
                    
                })
                .catch(err => console.error(`Failed fetching recommendation for ${symbol}`, err));
        });
    }, [symbols]);

    useEffect(() => {
        setLoading(true);
        // 如果沒有 symbol，就不執行
        if (symbols.length === 0) return;

        // TODO: change to handle one by one - 實現逐個抓取
        symbols.forEach(symbol => {
            // 針對每一個 symbol 單獨發送請求
            fetch(`http://localhost:8000/prices/stock/query-several?symbols=${symbol}&columns=close&limit=2`)
                .then(res => res.json())
                .then(data => {
                    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                        const price = data.data[0].close;
                        // 使用 functional update (prev => ...) 
                        // 確保不會覆蓋掉其他非同步請求已經寫入的價格
                        setPrices(prevPrices => ({
                            ...prevPrices,
                            [symbol]: price
                        }));
                        if (data.data[0].close >= data.data[1].close) {
                            setIncreaseDecrease(prev => ({
                                ...prev,
                                [symbol]: 'increased'
                            }));
                        } else if (data.data[0].close < data.data[1].close) {
                            setIncreaseDecrease(prev => ({
                                ...prev,
                                [symbol]: 'decreased'
                            }));
                        }
                    }

                })
                .catch(err => console.error(`Failed fetching price for ${symbol}`, err))
                .finally(() => setLoading(false));
        });
    }, [symbols]);

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

                const map = buildSectorMap(data);
                setSectorMap(map);
                const sectorNames = Object.keys(map);
                setSectors(sectorNames);
                // populate industries with all industries across sectors initially
                setIndustries(getAllIndustries(map));
                const info = buildSymbolInfo(map);
                setSymbolInfo(info);
            })
            .catch(err => {
                console.error('Failed fetching stocks', err);
                setRawData(null);
                setSymbols([]);
            })
            .finally(() => setLoading(false));
    }, []);

    

    useEffect(() => {
        // Fetch long and short names for symbols
        if (symbols.length === 0) return;

        symbols.forEach(symbol => {
            fetch(`http://localhost:8000/detail/stock?symbol=${symbol}`)
                .then(res => res.json())
                .then(data => {
                    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                        setLongName(prevNames => ({
                            ...prevNames,
                            [symbol]: data.data[0].Longname
                        }));
                    
                        setShortName(prevNames => ({
                            ...prevNames,
                            [symbol]: data.data[0].Shortname
                        }));
                    }
                })
                .catch(err => console.error(`Failed fetching info for ${symbol}`, err));
        });
    }, [symbols]);

    function handleSearchChange(event) {
        let input = event.target.value;
        setSearchTerm(input);
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
            if (Array.isArray(payload.data)) return extractSymbols(payload.data);
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

    const buildSectorMap = (payload) => {
        const map = {};
        if (!payload) return map;
        const dataArr = Array.isArray(payload.data) ? payload.data : (Array.isArray(payload) ? payload : []);
        dataArr.forEach(item => {
            if (typeof item !== 'object') return;
            Object.entries(item).forEach(([sectorName, industryObj]) => {
                if (!map[sectorName]) map[sectorName] = {};
                if (industryObj && typeof industryObj === 'object') {
                    Object.entries(industryObj).forEach(([industryName, symbolsArr]) => {
                        map[sectorName][industryName] = Array.isArray(symbolsArr) ? symbolsArr.slice() : extractSymbols(symbolsArr);
                    });
                }
            });
        });
        return map;
    }

    const buildSymbolInfo = (map) => {
        const info = {};
        Object.entries(map).forEach(([sector, industriesObj]) => {
            Object.entries(industriesObj).forEach(([industry, syms]) => {
                if (Array.isArray(syms)) {
                    syms.forEach(s => {
                        info[s] = { sector, industry };
                    });
                }
            });
        });
        return info;
    }

    const getAllIndustries = (map) => {
        const set = new Set();
        Object.values(map).forEach(indObj => {
            Object.keys(indObj).forEach(ind => set.add(ind));
        });
        return Array.from(set);
    }

    const getSymbolsForSelection = () => {
        let out = [];

        
        if (!selectedSector) {
            if (!selectedIndustry) {
                out = symbols.slice();
            } // All sectors & industries
            else {
                // collect symbols across all sectors for the selected industry
                Object.values(sectorMap).forEach(indObj => {
                    if (indObj && indObj[selectedIndustry]) out.push(...indObj[selectedIndustry]);
                });
            }
        } else {
            const sectorObj = sectorMap[selectedSector] || {};
            if (!selectedIndustry) {
                // flatten all industries under sector
                out = Object.values(sectorObj).flat();
            } else {
                out = sectorObj[selectedIndustry] || [];
            }
        }

        if (searchTerm) {
           // out = out.filter(s => s.includes(searchTerm.toUpperCase()));
           const upperInput = searchTerm.toUpperCase();
           out = out.filter(s => {
               const longN = longName[s] ? longName[s].toUpperCase() : '';
               const shortN = shortName[s] ? shortName[s].toUpperCase() : '';
               return s.includes(upperInput) || longN.includes(upperInput) || shortN.includes(upperInput);
           });
            
        } // filter symbols include input in search bar
        
        

        // dedupe and sort alphabetically
        return Array.from(new Set(out)).sort((a, b) => String(a).localeCompare(String(b)));
    }

    useEffect(() => {
        
        fetch(`http://localhost:8000/ticker-symbols/`)
            .then(res => res.json())
            .then(data => {
                setSymbols(data.tickers);
            })
            .catch(err => {
                console.error('Failed fetching ticker symbols', err);
                setSymbols([]);
            })
            
    }, []);

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:8000/category/stock')
            .then(res => res.json())
            .then(data => {
                setRawData(data);
                const found = extractSymbols(data);
                // dedupe and keep order
                const uniq = Array.from(new Set(found));
                //setSymbols(uniq);

                const map = buildSectorMap(data);
                setSectorMap(map);
                const sectorNames = Object.keys(map);
                setSectors(sectorNames);
                // populate industries with all industries across sectors initially
                setIndustries(getAllIndustries(map));
                const info = buildSymbolInfo(map);
                setSymbolInfo(info);
            })
            .catch(err => {
                console.error('Failed fetching stocks', err);
                setRawData(null);
                setSymbols([]);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        // 如果沒有 symbol，就不執行
        if (symbols.length === 0) return;

        // TODO: change to handle one by one - 實現逐個抓取
        symbols.forEach(symbol => {
            // 針對每一個 symbol 單獨發送請求
            // 注意：這裡因為只查一支股票，保留 limit=1 是合理的（抓最新一筆）
            fetch(`http://localhost:8000/prices/stock/query-several?symbols=${symbol}&columns=close&limit=1`)
                .then(res => res.json())
                .then(data => {
                    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                        const price = data.data[0].close;
                        // 使用 functional update (prev => ...) 
                        // 確保不會覆蓋掉其他非同步請求已經寫入的價格
                        setPrices(prevPrices => ({
                            ...prevPrices,
                            [symbol]: price
                        }));
                    }
                })
                .catch(err => console.error(`Failed fetching price for ${symbol}`, err));
        });
    }, [symbols]);
   /*useEffect(() => {
        const fetchBookmarks = async () => {
            const response = await fetch('http://localhost:8000/bookmark/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const bookmarks = data.map(item => item.stock_symbol);
                setBookmarkedSymbols(bookmarks);
            }
        };

        /*const fetchSymbols = async () => {
            setLoading(true);
            const response = await fetch('http://localhost:8000/category/stock'); // Adjust URL based on your backend
            if (response.ok) {
                const data = await response.json();
                const foundSymbols = extractSymbols(data); // Ensure you define this function correctly
                const uniqueSymbols = Array.from(new Set(foundSymbols));
                setSymbols(uniqueSymbols);
            }
            setLoading(false);
        };*/

        fetchBookmarks();
        //fetchSymbols();
    }, []);

    const toggleBookmark = async (symbol) => {
        const email = localStorage.getItem('user_email');  // Assume user's email is stored in localStorage
        if (bookmarks.includes(symbol)) {
            // Remove bookmark
            await fetch(`http://localhost:8000/bookmarks/remove?symbol=${symbol}&email=${email}`, {
                method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
            })
                .then(res => res.json())
                .catch(err => console.error('Failed to remove bookmark:', err));
            setBookmarks(prev => prev.filter(s => s !== symbol));
        } else {
            // Add bookmark with email and stock data
            await fetch(`http://localhost:8000/bookmarks/add?symbol=${symbol}&email=${email}`, {
                method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
            })
                .then(res => res.json())
                .catch(err => console.error('Failed to add bookmark:', err));
            setBookmarks(prev => [...prev, symbol]);
        }
    };

function bookmarkClick() {
        if (!islogin) {
            navigate("/login"); // Redirect to login if not authenticated
        } else {
            navigate("/bookmark"); // Redirect to bookmarks if authenticated
        }
    }

    function userClick() {
        if (!islogin) {
            navigate("/login");
        } else {
            navigate("/user");
        }
    }

    function symbolClick(symbol) {
        navigate(`/detail/${symbol}`)
    }

    return (
        <div>
            <div className="headerContainer">
                <button className='round-button' onClick={userClick}><img src={myImage} alt="" className='usericon'/><span className='label'>User</span></button>
                <input type="text" className='searchbar'placeholder="Search.." value={searchTerm} onChange={handleSearchChange}/>
                <button className='round-button' onClick={bookmarkClick}><img src={bookmarkimage} alt="" className='bookmarkicon'/><span className='blabel'>Bookmark</span></button>
            </div>
            <div className="background"></div>
            <div style={{display:'flex', gap:'12px', marginBottom:'12px', width:'100%', justifyContent:'center'}}>
                <div style={{display:'inline-block'}}>
                    <label style={{marginRight:'6px', fontWeight:'bold',textDecoration:'underline'  }}>Sector:</label>
                    <select className="selectbox" value={selectedSector} onChange={e => { const v = e.target.value; setSelectedSector(v); setSelectedIndustry(''); setIndustries(v && sectorMap[v] ? Object.keys(sectorMap[v]) : getAllIndustries(sectorMap)); }}>
                        <option value=''>All</option>
                        {sectors.map((sec) => (
                            <option key={sec} value={sec}>{sec}</option>
                        ))}
                    </select>
                </div>

                <div style={{display:'inline-block'}}>
                    <label style={{marginRight:'6px',fontWeight:'bold',textDecoration:'underline'}}>Industry:</label>
                    <select className="selectbox" value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)}>
                        <option value=''>All</option>
                        {industries.map((ind) => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="card-container" >
                {loading && <p style={{position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%'}}>Loading...</p>}
                {!loading && getSymbolsForSelection().length === 0 && (
                    
                    <p style={{position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%'}}>No stocks available</p>
                )}
                {!loading && getSymbolsForSelection().map((s, idx) => (
                    <div className='card'  key={`${s}-${idx}`} onClick={() => symbolClick(s)} style={{cursor: 'pointer',background: IncreaseDecrease[s] === 'increased' 
            ? 'linear-gradient(to bottom right, lightgreen, green)' 
            : IncreaseDecrease[s] === 'decreased' 
                ? 'linear-gradient(to bottom right, lightcoral, red)' 
                : 'linear-gradient(to bottom right, white, #f0f0f0)'}}>
                        <div style={{height:'30%', fontSize:'2.5em'}}>{s}</div>
                        <div style={{display: 'flex', flexDirection: 'column', height:'70%'}}>
                            <div style={{flex:'1'}}>
                                Last Close Price<br/>
                                {IncreaseDecrease[s] === 'increased' && <span style={{color:'green'}}>▲</span>}
                                {IncreaseDecrease[s] === 'decreased' && <span style={{color:'red'}}>▼</span>}
                                {prices[s] !== undefined ? prices[s].toFixed(2) : '-'}
                            </div>
                            <div style={{flex:'1'}}>
                                Recommendation<br/>
                                {recommendation[s] ? recommendation[s] : '-'}
                            </div>
                        <div style={{ flex: '1' }}>
                        <button stylex={{marginTop:'10px'}}onClick={(e) => {
                            e.stopPropagation(); // Prevents the event from bubbling up
                            toggleBookmark(s);
                        }}>
                        {bookmarkedSymbols.includes(s) ? 'Unbookmark' : 'Bookmark'}
                        </button>
                        </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}

export default Home;