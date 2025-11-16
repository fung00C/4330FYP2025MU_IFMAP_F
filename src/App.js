import React, { useState } from 'react';
import './styles/App.css';

function App() {
  // State to hold the prediction result, loading status, and error messages
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch the prediction from the backend
  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    // Sample input features matching the backend's expectation
    const inputFeatures = {
      "features": [
        0.05, 1.2, 0.03, 1.1, 0.04, 1.3, 0.01, 0.95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ]
    };

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputFeatures),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data.prediction); // Store the prediction value

    } catch (e) {
      setError(`Failed to fetch prediction: ${e.message}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Financial AI Model</h1>
        <p>Click the button to get a prediction from the model.</p>
        
        {/* Button to trigger the prediction */}
        <button onClick={handlePredict} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Get Prediction'}
        </button>

        {/* Display area for the prediction result or error */}
        <div className="result-container">
          {prediction !== null && (
            <h2>Prediction Result: {prediction.toFixed(8)}</h2>
          )}
          {error && <p className="error">{error}</p>}
        </div>
      </header>
    </div>
  );
}

export default App;