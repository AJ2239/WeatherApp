import React, { useState } from "react";
import { useWeatherQuery } from "./fetchweatherquery";

export default function WeatherApp() {
  const [city, setCity] = useState("");

  const { data, isLoading, isError, refetch } = useWeatherQuery(city);
  
  

  return (
    <div>
      <h1 className="text-white text-6xl font-extrabold text-center pt-4">
         🌦️Weather App
        </h1>
         <div  className=" flex justify-center gap-3 mt-8 ">
                
                <input value={city} onChange={(e) => setCity(e.target.value)} type="text" placeholder="Search for location" className=" w-[300px] h-[45px] rounded border-gray-900 pl-2  ">
                </input>
                <button onClick={refetch} className="text-white bg-blue-600 h-[45px]  rounded w-[70px] hover:bg-blue-700 ">Search</button>
              </div>

               {isLoading && <p className="w-16 h-16 border-4 border-white
                        border-t-transparent rounded-full animate-spin ml-[650px] mt-6"></p>}
               {isError && <p className="mt-6 text-red-700 text-center">Couldn't find Location.Try Again!</p>}

      {/* Data */}
        {data &&  (
            <div className="flex flex-col gap-5">
             <div className="text-center mt-20 bg-white w-[1000px] h-[300px] hover:scale-105 ml-40 rounded-xl flex gap-12 ">
              <div className="pt-12 pl-[100px] ">
              <h2 className="text-blue-700 text-5xl font-bold ">
                {data.location.name}, {data.location.country}
              </h2>
              <p className="pt-6 text-xl font-bold">
             {data.current.temp_c}°C (
            {data.current.condition.text})
          </p>
          
          <p className="text-xl pt-2">💧 Humidity: {data.current.humidity}%</p>
            <p className="text-xl">🌪 Wind: {data.current.wind_kph} km/h</p>
            <p className="text-xl text-gray-800">
                           {new Date(data.location.localtime).toLocaleDateString("en-US", {
                           weekday: "long",
                            year: "numeric",
                             month: "long",
                             day: "numeric",
                            })}            
                           </p>
             </div>
             <img src={data.current.condition.icon} alt="icon" className="  h-[250px] mt-6" />
             </div>
              
              <div className="">
               
                {data.forecast.forecastday.map((day) => (
                  
                     <div key={data.day} className="bg-white w-[1000px] h-[380px]  ml-40 mt-4 rounded-xl  ">
                       <h4 className="text-center text-2xl font-bold text-blue-700 pt-3">Daily Forecast</h4>
                      <div className="flex gap-6 justify-center">
                        <div className="text-xl pt-3 pl-40">
                       <h3 className="font-bold ">{day.date}</h3>
                        <p>Max {day.day.maxtemp_c}°C | Min {day.day.mintemp_c}°C</p>
                        <p className=" font-semibold">({day.day.condition.text})</p>
                        </div>
                         <img src={day.day.condition.icon} alt="" className=" w-[130px] h-[130px]"/>
                          </div>
                           <h4 className="text-center text-2xl font-bold text-blue-700">Hourly Forecast</h4>
                            <div className="overflow-x-auto whitespace-nowrap pb-3">
                              {day.hour.map((h) => (
                                 <div key={h.time_epoch} className="inline-block bg-blue-100 mt-5 ml-3 rounded w-[80px] h-[120px] text-center hover:scale-105">
                                    <p className="font-bold pt-4" >{h.time.split(" ")[1]}</p>
                                    <img src={h.condition.icon} alt="" className="w-[50px] ml-3"/>
                                     <p>{h.temp_c}°C</p>
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

