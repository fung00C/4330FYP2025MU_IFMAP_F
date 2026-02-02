import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BookmarkPage = () => {
    const [bookmarkedStocks, setBookmarkedStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookmarks = async () => {
            setLoading(true);
            const response = await fetch('http://localhost:8000/bookmark', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setBookmarkedStocks(data);
            } else {
                console.error('Failed to fetch bookmarks');
            }
            setLoading(false);
        };

        fetchBookmarks();
    }, []);

    const handleStockClick = (symbol) => {
        navigate(`/detail/${symbol}`); // Redirect to stock detail page
    };

    return (
        <div>
            <h1>Your Bookmarked Stocks</h1>
            {loading && <p>Loading bookmarks...</p>}
            {!loading && bookmarkedStocks.length === 0 && <p>No bookmarks available.</p>}
            <div className="bookmark-list">
                {!loading && bookmarkedStocks.map((bookmark) => (
                    <div 
                        key={bookmark.id} 
                        className="bookmark-item" 
                        onClick={() => handleStockClick(bookmark.stock_symbol)}
                        style={{ cursor: 'pointer', border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                        <h2>{bookmark.stock_symbol}</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookmarkPage;