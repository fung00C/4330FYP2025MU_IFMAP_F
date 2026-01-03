import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function Detail() {
    const { symbol } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return (
        <div>
            <h1>{symbol} detail page</h1>
            {loading && <div>Loading...</div>}
            {!loading && data && (
                <pre style={{whiteSpace:'pre-wrap', wordBreak:'break-word'}}>{JSON.stringify(data, null, 2)}</pre>
            )}
            {!loading && !data && <div>No data available</div>}
        </div>
    );
}

export default Detail;