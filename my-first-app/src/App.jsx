import { useState, useEffect } from 'react'; // Add useEffect here
import axios from 'axios';
import './App.css';
import Forecast from './Forecast';

function App() {
  const [city, setCity] = useState(''); // Stores what the user types
  const [weather, setWeather] = useState(null); // Stores the API result
  const [error, setError] = useState(''); // Stores error messages
  const [loading, setLoading] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);

  // Replace your old apiKey line with this:
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const [forecast, setForecast] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('weatherFavorites')) || []
  );

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
    });
  }, []);

  useEffect(() => {
    // If we already have a city searched, refresh the data with new units
    if (weather) {
      fetchWeatherData(`q=${weather.name}`);
    }
  }, [isCelsius]); // This runs every time isCelsius changes!

  // This helper function does the actual API calling for both Current and Forecast
  const fetchWeatherData = async (urlSuffix) => {
    setLoading(true);
    setError('');
    
    // Decide which unit string to send to the API
    const unitSystem = isCelsius ? 'metric' : 'imperial';
  
    try {
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?${urlSuffix}&units=${unitSystem}&appid=${apiKey}`
      );
      setWeather(currentRes.data);
  
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?${urlSuffix}&units=${unitSystem}&appid=${apiKey}`
      );
      
      const dailyData = forecastRes.data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
      setForecast(dailyData);
    } catch (err) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // --- NOW THE TWO TRIGGERS ---

  // Trigger 1: When user clicks the button or hits Enter
  const getWeather = () => {
    if (city) fetchWeatherData(`q=${city}`);
  };

  // Trigger 2: When the app auto-detects location
  const fetchWeatherByCoords = (lat, lon) => {
    fetchWeatherData(`lat=${lat}&lon=${lon}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather();
    }
  };

  const saveFavorite = () => {
    if (weather && !favorites.includes(weather.name)) {
      const newFavorites = [...favorites, weather.name];
      setFavorites(newFavorites);
      localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites));
    }
  };

  return (
    <div className="card">
      <h1 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>SkyCast</h1>
      
      {/* 1. MOVE THE SEARCH BOX UP so users can always see it */}
      <div className="search-box">
        <input 
          type="text" 
          placeholder="Enter city..." 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={getWeather}>Go</button>
      </div>
      <div className="unit-toggle">
        <button onClick={() => setIsCelsius(!isCelsius)}>
          Switch to {isCelsius ? 'Fahrenheit (°F)' : 'Celsius (°C)'}
        </button>
      </div>
      {loading && <p style={{ marginTop: '20px' }}>Updating...</p>}
      {error && <p style={{ color: '#ff4d4d', marginTop: '15px' }}>{error}</p>}

      {/* 2. PROTECT THE WEATHER DATA. Only show this if weather is NOT null */}
      {weather && (
        <>
          <div className="weather-info">
            <h2 style={{ marginBottom: '5px' }}>
              {weather.name} 
              <button onClick={saveFavorite} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>❤️</button>
            </h2>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`} 
              alt="icon" 
            />
            {/* Updated this line to be dynamic */}
            <p style={{ fontSize: '3rem', margin: '0', fontWeight: 'bold' }}>
              {Math.round(weather.main.temp)}°{isCelsius ? 'C' : 'F'}
            </p>
            <p style={{ textTransform: 'capitalize', color: '#aaa' }}>
              {weather.weather[0].description}
            </p>
          </div>
          
          <Forecast data={forecast} isCelsius={isCelsius} />
        </>
      )}
    </div>
  );
}

export default App;