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

  const toggleUnits = () => {
    const newUnitSetting = !isCelsius; // Calculate the next state
    setIsCelsius(newUnitSetting);     // Update the state for the UI
  
    // If there's already a city showing, refresh it with the new unit
    if (weather) {
      fetchWeatherData(`q=${weather.name}`, newUnitSetting);
    }
  };

  // This helper function does the actual API calling for both Current and Forecast
  const fetchWeatherData = async (urlSuffix, forcedUnit = isCelsius) => {
    setLoading(true);
    setError('');
    
    // Decide which unit string to send to the API
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
      <h1>WeatherApp </h1>
      
      <div className="search-box">
        <input 
          type="text" 
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress}
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
  
      {/* ONLY render this if weather is NOT null */}
      {weather && !loading && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p className="current-temp">
            {Math.round(weather.main.temp)}°{isCelsius ? 'C' : 'F'}
          </p>

          <p style={{ textTransform: 'capitalize', color: '#aaa' }}>
            {weather.weather[0].description}
          </p>
          
          {/* Only render this entire section if we actually have data */}
          {forecast.length > 0 && (
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