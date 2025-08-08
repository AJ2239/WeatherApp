import React, { useState } from "react";
import WeatherApp from "./components/WeatherApp";
import bg from "./components/background.jpg"
import icon from "./components/weathericon.png"

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div  className="min-h-screen  bg-cover bg-gradient-to-br from-blue-700 via-blue-300 to-blue-100 ">
      
     
      <WeatherApp/>
    </div>
  );
}



export default App;
