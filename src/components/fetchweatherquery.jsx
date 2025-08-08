import axios from "axios";
import { useQuery } from "@tanstack/react-query";
 

const fetchWeather = async (city) => {
    if (!city) return;
    const apiKey = "79557696e6b6410aa5372925250508";
    const res = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`
    );
    return res.data;
  };

  export const useWeatherQuery = (city) => {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => fetchWeather(city),
    enabled: false, 
    staleTime: 5 * 60 * 1000,
  });
};