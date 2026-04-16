import { useState, useEffect } from 'react';

const Weather = ({ capital }) => {
  // Stan przechowujący dane pogody
  const [weather, setWeather] = useState(null);
  
  // Stan wskazujący na błąd podczas pobierania pogody
  const [weatherError, setWeatherError] = useState('');
  
  // Stan wskazujący, czy trwa ładowanie danych pogody
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Efект uruchamiany gdy zmienia się nazwa stolicy
  useEffect(() => {
    if (!capital) return;

    setWeatherLoading(true);
    setWeatherError('');
    console.log('Fetching weather for:', capital);

    // Najpierw pobierz współrzędne miasta za pomocą Geocoding API
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${capital}&count=1&language=en&format=json`)
      .then(response => response.json())
      .then(data => {
        console.log('Geocoding response:', data);
        if (!data.results || data.results.length === 0) {
          throw new Error('City not found');
        }
        
        const city = data.results[0];
        const latitude = city.latitude;
        const longitude = city.longitude;
        console.log('City coordinates:', latitude, longitude);

        // Teraz pobierz dane pogody dla tych współrzędnych
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`);
      })
      .then(response => response.json())
      .then(data => {
        console.log('Weather response:', data);
        // Ustaw dane pogody w stanie
        setWeather(data);
      })
      .catch(err => {
        console.error('Weather error:', err);
        // W przypadku błędu, ustaw komunikat błędu
        setWeatherError('Could not fetch weather data');
      })
      .finally(() => {
        // Zawsze wyłącz stan ładowania
        setWeatherLoading(false);
      });
  }, [capital]);

  // Funkcja do interpretacji kodu pogody WMO
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return weatherCodes[code] || 'Unknown weather code';
  };

  // Wyświetl status ładowania
  if (weatherLoading) {
    return <div><h3>Weather in {capital}</h3><p>Loading weather data...</p></div>;
  }

  // Wyświetl błąd jeśli wystąpił
  if (weatherError) {
    return <div><h3>Weather in {capital}</h3><p>{weatherError}</p></div>;
  }

  // Wyświetl dane pogody
  if (weather && weather.current) {
    const current = weather.current;
    const description = getWeatherDescription(current.weather_code);

    return (
      <div>
        <h3>Weather in {capital}</h3>
        <p>Temperature: {current.temperature_2m}°C</p>
        <p>Wind speed: {current.wind_speed_10m} m/s</p>
        <p>Description: {description}</p>
      </div>
    );
  }

  return null;
};

export default Weather;
