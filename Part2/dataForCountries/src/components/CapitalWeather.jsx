import axios from "axios";
import { useState, useEffect } from 'react';
const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

const CapitalWeather = ({ country }) => {
    const [weather, setWeather] = useState(null);
    const lat = country.capitalInfo.latlng[0];
    const lng = country.capitalInfo.latlng[1];

    useEffect(() => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;

        const getCapitalWeather = () => {
          axios.get(apiUrl)
            .then(response =>response.data)
            .then(initialWeather => setWeather(initialWeather))
        };

        getCapitalWeather();
        
    }, [lat, lng]);

  return (  
        <div>
            {weather ? (
        <div>
           <h2>Weather in {country.capital}</h2>
                <p>Temperature: {(weather.main.temp - 273.15).toFixed(1)}°C</p>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather icon"/>
                <p>Weather: {weather.weather[0].main}</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
        </div>
  );
};

export default CapitalWeather;
