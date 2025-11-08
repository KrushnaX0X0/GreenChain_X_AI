import React, { useEffect, useState } from "react";
import gsap from "gsap";
import axios from "axios";
import { WiDaySunny, WiCloud, WiRain, WiSnow } from "react-icons/wi";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Loading...");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY =
    import.meta.env.VITE_WEATHER_API_KEY || "1ba772ce109561d482871658bb494843 ";

  
  const fetchWeatherByLocation = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      console.log(response.data)
      setWeatherData(response.data);
      setCity(response.data.name);
      setError(null);
    } catch (err) {
      console.error("Error fetching weather:", err);
      setError("Unable to fetch weather for your location.");
    } finally {
      setLoading(false);
    }
  };



  
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // console.log(latitude, longitude);
        fetchWeatherByLocation(latitude, longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        if (err.code === 1)
          setError("Location permission denied. Please allow access.");
        else if (err.code === 2)
          setError("Position unavailable. Try again later.");
        else if (err.code === 3)
          setError("Location request timed out.");
        else setError("Unable to get your location.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  
  useEffect(() => {
    getUserLocation();
  }, []);

  
  useEffect(() => {
    if (weatherData) {
      gsap.from("#weather-card", {
        opacity: 1,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      gsap.to("#weather-icon", {
        y: -10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });

      gsap.from("#weather-button", {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.5,
        ease: "back.out(1.5)",
      });
    }
  }, [weatherData]);

  
  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return (
          <WiDaySunny id="weather-icon" className="text-yellow-500 text-6xl" />
        );
      case "Clouds":
        return <WiCloud id="weather-icon" className="text-gray-400 text-6xl" />;
      case "Rain":
        return <WiRain id="weather-icon" className="text-blue-500 text-6xl" />;
      case "Snow":
        return <WiSnow id="weather-icon" className="text-blue-200 text-6xl" />;
      default:
        return (
          <WiDaySunny id="weather-icon" className="text-yellow-500 text-6xl" />
        );
    }
  };

  
  if (loading && !weatherData) {
    return (
      <div className="rounded-xl shadow-2xl p-6 flex justify-center items-center h-60">
        Detecting location & loading weather...
      </div>
    );
  }

  
  if (error && !weatherData) {
    return (
      <div className="rounded-xl shadow-2xl p-6 flex flex-col justify-center items-center h-60 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          id="weather-button"
          onClick={getUserLocation}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  
  return (
    <div
      id="weather-card"
      className="rounded-xl shadow-2xl p-6 flex flex-col gap-5 justify-between hover:scale-105 transition-transform duration-500"
    >
      <div className="flex items-center gap-4 ">
        {getWeatherIcon(weatherData?.weather?.[0]?.main)}
        <div>
          <h2 className="text-2xl font-bold text-green-800 mb-1">
            {city} Weather
          </h2>
          <p className="text-black">
            {weatherData?.weather?.[0]?.description} <br />
            Temperature:{" "}
            <span className="font-semibold">{weatherData?.main?.temp}°C</span>{" "}
            <br />
            Humidity:{" "}
            <span className="font-semibold">{weatherData?.main?.humidity}%</span>{" "}
            <br />
            Wind:{" "}
            <span className="font-semibold">{weatherData?.wind?.speed} m/s</span>
          </p>
        </div>
      </div>

      <button
        id="weather-button"
        onClick={getUserLocation}
        className="self-start mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Detect My Location
      </button>
    </div>
  );
};

export default Weather;
