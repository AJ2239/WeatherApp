import React, { useState } from "react";
import WeatherApp from "./components/WeatherApp";
import bg from "./components/background.jpg"

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "dark" : ""} >
      <div style={{backgroundImage: `url(${bg})`, backgroundRepeat: "no-repeat"}} className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 transition duration-300 bg-cover">
        {/* Toggle Switch */}
        <div className="flex justify-end p-4 items-center gap-2">
  <span>🌞</span>
  <label className="inline-flex items-center cursor-pointer relative">
    <input
      type="checkbox"
      checked={darkMode}
      onChange={(e) => setDarkMode(e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-600 peer-checked:bg-blue-600 transition"></div>
    <div className="absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
  </label>
  <span>🌙</span>
</div>

        {/* Weather App */}
        <WeatherApp />
      </div>
    </div>
  );
}

export default App;
