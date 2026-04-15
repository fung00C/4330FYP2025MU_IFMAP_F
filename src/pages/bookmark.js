import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import homeimage from '../image/home.png'
import unnotification from '../image/unnotification.png'
import notification from '../image/notification.png'
import '../styles/bookmark.css';
const BookmarkPage = () => {
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [symbols, setSymbols] = useState([]);
    const [rawData, setRawData] = useState(null);
    const [prices, setPrices] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [sectorMap, setSectorMap] = useState({});
    const [sectors, setSectors] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState(''); 
    const [symbolInfo, setSymbolInfo] = useState({}); 
    const [bookmarkedSymbols, setBookmarkedSymbols] = useState([]);

    const [IncreaseDecrease, setIncreaseDecrease] = useState({});
    const [recommendation, setRecommendation] = useState({});
    const email = localStorage.getItem('user_email');

    function homeClick(){
      navigate("/")
    }
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
         setLoading(true);
         // 如果沒有 symbol，就不執行
        if (bookmarks.length === 0) return;
    
        // TODO: change to handle one by one - 實現逐個抓取
        bookmarks.forEach(symbol => {
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
    }, [bookmarks]);

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

     function handleSearchChange(event) {
            let input = event.target.value.toUpperCase();
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
                    out = bookmarks.slice();
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
                out = out.filter(s => s.includes(searchTerm));
            } // filter symbols include input in search bar
    
            // dedupe and sort alphabetically
            return Array.from(new Set(out)).sort((a, b) => String(a).localeCompare(String(b)));
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
            if (bookmarks.length === 0) return;
    
            // TODO: change to handle one by one - 實現逐個抓取
            bookmarks.forEach(symbol => {
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
        }, [bookmarks]);
        useEffect(() => {
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
    
            const fetchSymbols = async () => {
                setLoading(true);
                const response = await fetch('http://localhost:8000/category/stock'); // Adjust URL based on your backend
                if (response.ok) {
                    const data = await response.json();
                    const foundSymbols = extractSymbols(data); // Ensure you define this function correctly
                    const uniqueSymbols = Array.from(new Set(foundSymbols));
                    setSymbols(uniqueSymbols);
                }
                setLoading(false);
            };
    
            fetchBookmarks();
            fetchSymbols();
        }, []);
    
        const toggleBookmark = async (symbol) => {
            const email = localStorage.getItem('user_email');  // Assume user's email is stored in localStorage
            if (bookmarkedSymbols.includes(symbol)) {
                // Remove bookmark
                await fetch(`http://localhost:8000/bookmark/${symbol}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                setBookmarkedSymbols(bookmarkedSymbols.filter(s => s !== symbol));
            } else {
                console.error('Failed to fetch bookmarks');
            }
            setLoading(false);
        };

    

    const handleStockClick = (symbol) => {
        navigate(`/detail/${symbol}`); // Redirect to stock detail page
    };

    return (
        <>
        <h1>Bookmark</h1>
        <div className="background"></div>
        <button className='homebutton' onClick={homeClick}><img src={homeimage} alt="" className='homeicon'/></button>
        <div className="card-container">
                
                {loading && <div className='card'>Loading...</div>}
                {!loading && getSymbolsForSelection().length === 0 && (
                    <div className='card'>No stocks available</div>
                )}
                {!loading && getSymbolsForSelection().map((s, idx) => (
                    <div className='card'  key={`${s}-${idx}`} onClick={() => handleStockClick(s)} style={{cursor: 'pointer',background: IncreaseDecrease[s] === 'increased' 
            ? 'linear-gradient(to right, white, lightgreen)' 
            : IncreaseDecrease[s] === 'decreased' 
                ? 'linear-gradient(to right, white, lightcoral)' 
                : 'linear-gradient(to right, white, #f0f0f0)'}}>
                        <div style={{height:'30%', display:'flex', width:'100%'}}>
                            <p style={{margin:'auto 0', fontSize:'35px'}}>{s}</p>
                            <button className="notificationbutton"
                        onClick={(e) => {
                        e.stopPropagation(); // Prevents the event from bubbling up
                        toggleBookmark(s);
                        }}
>
                        <img src={bookmarkedSymbols.includes(s) ? notification : unnotification}
                        alt={bookmarkedSymbols.includes(s) ? 'Cancel notification' : 'Notification'}
                        style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                        </button>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width:'100%', alignItems: 'flex-start', height:'70%'}}>
                            <div style={{flex:'1'}}>
                                <strong>Last Close Price</strong><br/>
                                {IncreaseDecrease[s] === 'increased' && <span style={{color:'green'}}>▲</span>}
                                {IncreaseDecrease[s] === 'decreased' && <span style={{color:'red'}}>▼</span>}
                                <span style={{fontSize:'25px'}}>{prices[s] !== undefined ? prices[s].toFixed(2) : '-'}</span>
                            </div>
                            <div style={{flex:'1'}}>
                                <strong>Recommendation</strong><br/>
                                <span style={{fontSize:'25px'}}>{recommendation[s] ? recommendation[s] : '-'}</span>
                            </div>
                        
                        </div>
                        
                    </div>
                ))}
                
            </div>
            <footer style={{textAlign:'center', padding:'12px', color:'#888'}}>
                    <p>@2025-2026 Yishu3 Intelligence Financial Market Analysis Platform</p>
                </footer>
            </>
    );
};

export default BookmarkPage;