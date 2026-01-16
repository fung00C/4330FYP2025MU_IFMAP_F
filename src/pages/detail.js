import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';

function Detail() {
    const { symbol } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [priceData, setPriceData] = useState(null);
    const [priceLoading, setPriceLoading] = useState(true);

    const getTodayYYYYMMDD = () => new Date().toISOString().split('T')[0];
    const getLastYearYYYYMMDD = () => new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split('T')[0];

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
        setLoading(true);
        fetch(`http://localhost:8000/detail/stock?symbol=${symbol}`)
            .then(res => res.json())
            .then(data => {
                setData(data);
            })
            .catch(err => {
                console.error('Failed fetching detail', err);
                setData(null);
            })
            .finally(() => setLoading(false));
    }, [symbol]);

    useEffect(() => {
        setPriceLoading(true);
        const startDate = getLastYearYYYYMMDD();
        const endDate = getTodayYYYYMMDD();
        fetch(`http://localhost:8000/prices/stock/query-all?symbols=${symbol}&start_date=${startDate}&end_date=${endDate}`)
            .then(res => res.json())
            .then(data => {
                setPriceData(data);
            })
            .catch(err => {
                console.error('Failed fetching price data', err);
                setPriceData(null);
            })
            .finally(() => setPriceLoading(false));
    }, [symbol]);

    const chartData = transformPriceData(priceData);

    return (
        <div>
            <h1>{symbol} detail page</h1>
            {loading && <div>Loading...</div>}
            {!loading && data && data.data && (
                <>
                    <div style={{borderTop:'2px solid #ddd', textAlign:'justify'}}>
                        <h2>Stock Information</h2>
                        <strong>Exchange:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Exchange || 'N/A') : 'N/A'}<br/>
                        <strong>Shortname:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Shortname || 'N/A') : 'N/A'}<br/>
                        <strong>Longname:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Longname || 'N/A') : 'N/A'}<br/>
                        <strong>Sector:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Sector || 'N/A') : 'N/A'}<br/>
                        <strong>Industry:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Industry || 'N/A') : 'N/A'}<br/>
                        <strong>Marketcap:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Marketcap || 'N/A') : 'N/A'}<br/>
                        <strong>Ebitda:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Ebitda || 'N/A') : 'N/A'}<br/>
                        <strong>Revenue growth:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Revenuegrowth || 'N/A') : 'N/A'}<br/>
                        <strong>City:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].City || 'N/A') : 'N/A'}<br/>
                        <strong>State:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].State || 'N/A') : 'N/A'}<br/>
                        <strong>Country:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Country || 'N/A') : 'N/A'}<br/>
                        <strong>Fulltime employees:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Fulltimeemployees || 'N/A') : 'N/A'}<br/>
                        <strong>Long business summary:</strong> {Array.isArray(data.data) && data.data.length > 0 ? (data.data[0].Longbusinesssummary || 'N/A') : 'N/A'}<br/>
                    </div>
                </>
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

export default Detail;