// src/Forecast.jsx
// 1. Make sure isCelsius is included in the curly braces here
function Forecast({ data, isCelsius }) { 
  return (
    <div className="forecast-container">
      {data.map((day, index) => (
        <div key={index} className="forecast-item">
          <p>{new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
          <img 
            src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
            alt="icon" 
          />
          <p style={{ fontWeight: 'bold' }}>
            {/* 2. USE isCelsius HERE, NOT "weather" */}
            {Math.round(day.main.temp)}°{isCelsius ? 'C' : 'F'}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Forecast;
