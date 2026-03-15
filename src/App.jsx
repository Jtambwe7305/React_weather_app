import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Forecast from './Forecast';

function App() {
  const [city, setCity] = useState(''); 
  const [weather, setWeather] = useState(null); 
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);

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

  const toggleUnits = () => {
    const newUnitSetting = !isCelsius; 
    setIsCelsius(newUnitSetting);     
  
    if (weather) {
      fetchWeatherData(`lat=${weather.coord.lat}&lon=${weather.coord.lon}`, newUnitSetting);
    }
  };

  const fetchWeatherData = async (urlSuffix, forcedUnit = isCelsius) => {
    setLoading(true);
    setError('');
    
    const unitSystem = forcedUnit ? 'metric' : 'imperial';
  
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

  const getWeather = () => {
    if (city.trim() !== '') {
      fetchWeatherData(`q=${city}`);
    } else {
      setError("Please enter a location (e.g., Rochester, NY, US)");
    }
  };

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
      <h1>Weather App</h1>
      
      {/* Notice the <Select /> component is completely gone from here! */}
      <div className="search-box">
        <input 
          type="text" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder='e.g., Rochester, NY, US'
        />
        <button onClick={getWeather}>Go</button>
      </div>
  
      <div className="unit-toggle">
        <button onClick={toggleUnits}>
          {isCelsius ? 'Switch to °F' : 'Switch to °C'}
        </button>
      </div>
  
      {loading && <p>Updating...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
  
      {weather && !loading && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p className="current-temp">
            {Math.round(weather.main.temp)}°{isCelsius ? 'C' : 'F'}
          </p>

          <p style={{ textTransform: 'capitalize', color: '#aaa' }}>
            {weather.weather[0].description}
          </p>
          
          {weather && forecast.length > 0 && (
            <div className="forecast-section">
              <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>5-Day Forecast</h3>
              <Forecast data={forecast} isCelsius={isCelsius} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;