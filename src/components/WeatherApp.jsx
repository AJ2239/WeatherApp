import React, { useState, useEffect } from "react";
import axios from "axios";
import icon from "./weathericon.png";

export default function WeatherApp() {
  const [city, setCity] = useState(localStorage.getItem("wc_city") || "");
  const [data, setData] = useState(
    JSON.parse(localStorage.getItem("wc_data")) || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiKey = "79557696e6b6410aa5372925250508";

  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=12`
      );
      setData(res.data);
      localStorage.setItem("wc_city", city);
      localStorage.setItem("wc_data", JSON.stringify(res.data));
    } catch (err) {
      setError("City not found or API error!");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (city && data === null) getWeather();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white flex">
        <img src={icon} alt="" className="size-12" />
        Weather Forecast
      </h1>

      <div className="flex gap-2">
        <input
          className="px-4 py-2 border rounded-lg focus:outline-none dark:bg-gray-800"
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button
          onClick={getWeather}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-6 animate-pulse">Loading...</p>}
      {error && <p className="mt-6 text-red-500">{error}</p>}

      {data && !loading && (
        <div className="mt-10 max-w-6xl w-full px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 mb-8 flex items-center gap-6">
            <img src={data.current.condition.icon} alt="icon" className="w-20 h-20" />
            <div>
              <h2 className="text-xl font-bold text-blue-700">
                {data.location.name}, {data.location.country}
              </h2>
              <p className="text-lg">
                {data.current.temp_c}°C — {data.current.condition.text}
              </p>
            </div>
          </div>

          {/* Daily + Hourly Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5">
            {data.forecast.forecastday.map((day) => (
              <div key={day.date} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
                <div className="text-center hover:scale-105 transform transition">
                  <p className="font-semibold mb-1">{day.date}</p>
                  <img src={day.day.condition.icon} alt="icon" className="w-16 h-16 mx-auto" />
                  <p className="mt-1">{day.day.condition.text}</p>
                  <p className="mt-2">Max: {day.day.maxtemp_c}°C</p>
                  <p>Min: {day.day.mintemp_c}°C</p>
                </div>

                {/* hourly scroll */}
                <div className="mt-4 overflow-x-auto whitespace-nowrap">
                  {day.hour.map((hr) => (
                    <div
                      key={hr.time_epoch}
                      className="inline-block bg-blue-100 dark:bg-gray-700 rounded-lg px-3 py-2 m-1 text-xs text-center"
                    >
                      <p className="font-medium">{hr.time.split(" ")[1]}</p>
                      <img src={hr.condition.icon} className="w-6 h-6 mx-auto" alt="icon" />
                      <p>{hr.temp_c}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
