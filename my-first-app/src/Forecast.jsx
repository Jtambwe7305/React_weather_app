// src/Forecast.jsx
function Forecast({ data }) {
    if (!data || data.length === 0) return null;
  
    return (
      <div style={{ 
        marginTop: '30px', 
        display: 'flex', 
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '20px'
      }}>
        {data.map((day, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#aaa', margin: '0' }}>
              {new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
            </p>
            <img 
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`} 
              alt="icon" 
              style={{ width: '40px' }}
            />
            <p style={{ fontSize: '3rem', margin: '0', fontWeight: 'bold' }}>
              {Math.round(weather.main.temp)}°{isCelsius ? 'C' : 'F'}
            </p>
          </div>
        ))}
      </div>
    );
  }
  
  export default Forecast;