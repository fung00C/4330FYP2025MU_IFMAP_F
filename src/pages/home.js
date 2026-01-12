import React, {useEffect, useState} from 'react';
import '../styles/home.css';
import {useNavigate} from 'react-router-dom';
import myImage from '../image/pngtree-outline-user-icon-png-image_1727916.jpg'

function Home() {
    const navigate = useNavigate();
    const [symbols, setSymbols] = useState([]);
    const [rawData, setRawData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');

    const [sectorMap, setSectorMap] = useState({});
    const [sectors, setSectors] = useState([]);
    const [industries, setIndustries] = useState([]);
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState(''); 
    const [symbolInfo, setSymbolInfo] = useState({}); 

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

    
    function bookmarkClick() {
        navigate("/bookmark")
    }

    function userClick() {
        navigate("/user")
    }

    function symbolClick(symbol) {
        navigate(`/detail/${symbol}`)
    }

    return (
        <div>
            <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px'}}>
                <button className='round-button' onClick={userClick} img src={myImage}>user</button>
                <input type="text" className='searchbar' value={searchTerm} onChange={handleSearchChange}/>
                <button className='round-button' onClick={bookmarkClick}>bookmark</button>
            </div>
            
            <div style={{display:'flex', gap:'12px', marginBottom:'12px'}}>
                <div style={{display:'inline-block'}}>
                    <label style={{marginRight:'6px'}}>Sector:</label>
                    <select value={selectedSector} onChange={e => { const v = e.target.value; setSelectedSector(v); setSelectedIndustry(''); setIndustries(v && sectorMap[v] ? Object.keys(sectorMap[v]) : getAllIndustries(sectorMap)); }}>
                        <option value=''>All</option>
                        {sectors.map((sec) => (
                            <option key={sec} value={sec}>{sec}</option>
                        ))}
                    </select>
                </div>

                <div style={{display:'inline-block'}}>
                    <label style={{marginRight:'6px'}}>Industry:</label>
                    <select value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)}>
                        <option value=''>All</option>
                        {industries.map((ind) => (
                            <option key={ind} value={ind}>{ind}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="container">
                {loading && <div className='card'>Loading...</div>}
                {!loading && getSymbolsForSelection().length === 0 && (
                    <div className='card'>No stocks available</div>
                )}
                {!loading && getSymbolsForSelection().map((s, idx) => (
                    <div className='card'  key={`${s}-${idx}`} onClick={() => symbolClick(s)} style={{cursor: 'pointer'}}>
                        <div style={{height:'30%', fontSize:'2.5em'}}>{s}</div>
                        <div style={{display: 'flex', alignItems:'center', width:'100%'}}>
                            <div style={{flex:'1'}}>
                                current price<br />
                                
                            </div>
                            <div style={{flex:'1'}}>
                                recommendation<br />
                                
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Home;
