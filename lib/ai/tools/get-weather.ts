import { model } from "@/lib/ai";

export async function getWeather({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,interval&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`
    );

    if (!response.ok) {
      throw new Error("Weather API request failed");
    }

    const weatherData = await response.json();
    return {
      ...weatherData,
      content: `Current temperature is ${weatherData.current.temperature_2m}°${weatherData.current_units.temperature_2m}`,
    };
  } catch (error) {
    console.error("Error fetching weather:", error);
    throw error;
  }
}
