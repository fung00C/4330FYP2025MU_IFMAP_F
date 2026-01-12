import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';

function Index() {
    const [currentPrice, setCurrentPrice] = useState(null);
    const [recommendation, setRecommendation] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [priceData, setPriceData] = useState(null);
    const [priceLoading, setPriceLoading] = useState(true);
    
    const getTodayYYYYMMDD = () => new Date().toISOString().split('T')[0];
    const getLastYearYYYYMMDD = () => new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];

    useEffect(() => {
            setLoading(true);
            fetch(`http://localhost:8000/prices/index/query-several?symbols=%5EGSPC&columns=close&limit=1`)
                .then(res => res.json())
                .then(data => {
                    setCurrentPrice(data);
                })
                .catch(err => {
                    console.error('Failed fetching current price', err);
                    setCurrentPrice(null);
                })
                .finally(() => setLoading(false));
        }, []);

    useEffect(() => {
            setLoading(true);
            fetch(`http://localhost:8000/recommendation/index?symbol=%5EGSPC`)
                .then(res => res.json())
                .then(data => {
                    setRecommendation(data);
                })
                .catch(err => {
                    console.error('Failed fetching current price', err);
                    setRecommendation(null);
                })
                .finally(() => setLoading(false));
        }, []);

    useEffect(() => {
            setLoading(true);
            fetch(`http://localhost:8000/detail/index?symbol=%5EGSPC`)
                .then(res => res.json())
                .then(data => {
                    setData(data);
                })
                .catch(err => {
                    console.error('Failed fetching detail', err);
                    setData(null);
                })
                .finally(() => setLoading(false));
        }, []);

    const transformPriceData = (raw) => {
        if (!raw) return [];
        const arr = raw.data || [];
        if (!Array.isArray(arr)) return [];
        const mapped = arr.map(item => ({
            date: item.date || item.Date || item.datetime || item.timestamp || '',
            close: item.close || item.Close || item.adj_close || item.close_price || null
        })).filter(d => d.date && d.close !== null);
        mapped.sort((a, b) => new Date(a.date) - new Date(b.date));
        return mapped;
    };

    useEffect(() => {
            setPriceLoading(true);
            const startDate = getLastYearYYYYMMDD();
            const endDate = getTodayYYYYMMDD();
            fetch(`http://localhost:8000/prices/index/query-all?symbols=%5EGSPC&start_date=${startDate}&end_date=${endDate}`)
                .then(res => res.json())
                .then(data => {
                    setPriceData(data);
                })
                .catch(err => {
                    console.error('Failed fetching price data', err);
                    setPriceData(null);
                })
                .finally(() => setPriceLoading(false));
        }, []);
    
        const chartData = transformPriceData(priceData);

    return (
        <div>
            <h1>Index Page</h1>
            <div style={{display:'flex', borderTop:'2px solid #ddd'}}>
                {loading && <div>Loading...</div>}
                {!loading && currentPrice && currentPrice.data && (
                    <div style={{flex:'1'}}>
                        <strong>Current price:</strong> {Array.isArray(currentPrice.data) && currentPrice.data.length > 0 ? (currentPrice.data[0].close || 'N/A') : 'N/A'}<br/>
                    </div>   
                )}
                {loading && <div>Loading...</div>}
                {!loading && recommendation && recommendation.data && (
                    <div style={{flex:'1'}}>
                        <strong>Recommendation:</strong> {Array.isArray(recommendation.data) && recommendation.data.length > 0 ? (recommendation.data[0].recommendation || 'N/A') : 'N/A'}<br/>
                    </div>
                )}
            </div>
            

            {!loading && data && data.data && (
                <div style={{borderTop:'2px solid #ddd'}}>
                    <h2>Stock Information</h2>
                    <strong>Composition:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Composition || 'N/A') : 'N/A'}<br/>
                        <strong>Weighting:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Weighting || 'N/A') : 'N/A'}<br/>
                        <strong>Purpose:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Purpose || 'N/A') : 'N/A'}<br/>
                        <strong>Management:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Management || 'N/A') : 'N/A'}<br/>
                        <strong>Accessibility:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Accessibility || 'N/A') : 'N/A'}<br/>
                        <strong>Sectors:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Sectors || 'N/A') : 'N/A'}<br/>
                    </div>
                
            )}

            {!loading && (!data || !data.data) && <div>No data available</div>}
                        {priceLoading && <div>Loading price data...</div>}
                        {!priceLoading && chartData && chartData.length > 0 && (
                            <div style={{marginTop:'32px', borderTop:'2px solid #ddd'}}>
                                <h2>Close Price History</h2>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
                                            <Brush dataKey="date" height={30} stroke="#8884d8" travellerWidth={10} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        {!priceLoading && (!chartData || chartData.length === 0) && <div>No price data available</div>}
        </div>
    );
}

export default Index;