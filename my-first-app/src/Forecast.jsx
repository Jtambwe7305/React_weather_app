// src/Forecast.jsx
// 1. Make sure isCelsius is included in the curly braces here
function Forecast({ data, isCelsius }) { 
  return (
    <div className="forecast-container">
      {data.map((day, index) => (
        <div key={index} className="forecast-item">
        <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: '0' }}>
          {new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}
        </p>
        <img 
          src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} // Added @2x for better quality
          alt="icon" 
          style={{ width: '40px', height: '40px' }}
        />
        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0' }}>
          {Math.round(day.main.temp)}°{isCelsius ? 'C' : 'F'}
        </p>
      </div>
      ))}
    </div>
  );
}

export default Forecast;
