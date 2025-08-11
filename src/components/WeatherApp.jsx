import React, { useState,useEffect,useRef } from "react";
import { useWeatherQuery } from "./fetchweatherquery";
import axios from "axios";


export default function WeatherApp() {
  const [city, setCity] = useState("");
// .....suggestions....
const wrapperRef = useRef();
useEffect(() => {
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const [suggestions, setSuggestions] = useState([]);

const apiKey = "79557696e6b6410aa5372925250508";
const fetchSuggestions = async (query) => {
  if (!query) {
    setSuggestions([]);
    return;
  }
  try {
    const res = await axios.get(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
    setSuggestions(res.data);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
};

//  .....user current location....
  const [coords, setCoords] = useState(null);
  const { data, isLoading, isError, refetch } = useWeatherQuery(city||coords);
   useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        // Weather API accepts lat,lon format as query
        setCoords(`${lat},${lon}`);
      },
      (error) => {
        console.error("Location access denied:", error.message);
      }
    );
  }, []);

  
useEffect(() => {
    if (coords) {
      refetch();
    }
  }, [coords, refetch]);
  // .....suggestion......
useEffect(() => {
  if (city) {
    refetch();
  }
}, [city, refetch]);
    
  return (
    <div>
      <h1 className="text-white text-6xl font-extrabold text-center pt-4">
         🌦️Weather App
        </h1>
         <div  ref={wrapperRef} className=" flex justify-center gap-3 mt-8 ">
                
                <input value={city} onChange={(e) => {setCity(e.target.value);fetchSuggestions(e.target.value)}} type="text" placeholder="Search for location" className="w-sm lg:w-[300px] h-[45px] rounded border-gray-900 pl-2  ">
                </input>
                {suggestions.length > 0 && (
      <ul className="absolute right-26 bg-white border border-gray-300 rounded w-[300px] mt-12 max-h-60 lg:mr-20 ">
        {suggestions.map((location, index) => (
          <li
            key={index}
            className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
            onClick={() => {
              setCity(location.name + ", " + location.country);
              setSuggestions([]); 
              // refetch();
            }}
          >
            {location.name}, {location.country}
          </li>
        ))}
      </ul>
    )}
                <button onClick={refetch} className="text-white bg-blue-600 h-[45px]  rounded w-[70px] hover:bg-blue-700 ">Search</button>
              </div>
                
               {isLoading && <p className="w-16 h-16 border-4 border-white
                        border-t-transparent rounded-full animate-spin mx-auto  mt-6"></p>}
               {isError && <p className="mt-6 text-red-700 text-center">Couldn't find Location.Try Again!</p>}
                 
      {/* Data */}
        {data &&  (
            <div className="flex flex-col gap-5 justify-center ">
             <div className="text-center mt-20 m-6 bg-white w-auto h-auto lg:w-auto lg:h-auto   rounded-xl flex justify-center flex-col lg:flex-row lg:gap-8  ">
              <div className="pt-12 text-center lg:pl-[100px] lg:pb-5">
              <h2 className="text-blue-700 text-3xl lg:text-5xl font-bold ">
                {data.location.name}, {data.location.country}
              </h2>
              <p className="pt-6 text-xl font-bold">
             {data.current.temp_c}°C (
            {data.current.condition.text})
          </p>
          
          <p className="text-xl pt-2">💧 Humidity: {data.current.humidity}%</p>
            <p className="text-xl">🌪 Wind: {data.current.wind_kph} km/h</p>
            <p className="text-xl">🌧 Chance of Rain: {data.forecast.forecastday[0].day.daily_chance_of_rain}%</p>
            <p className="text-xl text-gray-800">
                           {new Date(data.location.localtime).toLocaleDateString("en-US", {
                           weekday: "long",
                            year: "numeric",
                             month: "long",
                             day: "numeric",
                            })}            
                           </p>
             </div>
             <img src={data.current.condition.icon} alt="icon" className=" md:ml-64 md:h-[200px] md:w-[200px] h-[250px] mt-6 lg:ml-6 lg:w-xl lg:h-xl" />
             </div>
              
              <div className="">
               
                {data.forecast.forecastday.map((day) => (
                  
                     <div key={data.day} className="bg-white m-6  w-auto h-auto lg:w-auto lg:h-auto   mt-4 rounded-xl  ">
                       <h4 className="text-center text-2xl font-bold text-blue-700 pt-3">Daily Forecast</h4>
                      <div className=" flex flex-col lg:flex-row gap-6  justify-center">
                        <div className="text-xl text-center pt-3 lg:pl-60">
                       <h3 className="font-bold ">{day.date}</h3>
                        <p>Max {day.day.maxtemp_c}°C | Min {day.day.mintemp_c}°C</p>
                        <p>🌧 Chance of Rain: {day.day.daily_chance_of_rain}%</p>
                        <p className=" font-semibold">({day.day.condition.text})</p>
                        </div>
                         <img src={day.day.condition.icon} alt="" className="ml-20 w-[130px] h-[130px] md:ml-72 lg:ml-20"/>
                          </div>
                           <h4 className="text-center text-2xl font-bold text-blue-700">Hourly Forecast</h4>
                            <div className="overflow-x-auto whitespace-nowrap  pb-3 lg:pb-4">
                              {day.hour.map((h) => (
                                 <div key={h.time_epoch} className="inline-block bg-blue-100 mt-5 ml-3 rounded w-[80px] h-auto text-center hover:scale-105">
                                    <p className="font-bold pt-4" >{h.time.split(" ")[1]}</p>
                                    <img src={h.condition.icon} alt="" className="w-[50px] ml-3"/>
                                     <p>{h.temp_c}°C</p>
                                      <p className="pb-3">🌧 {h.chance_of_rain}%</p>
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

