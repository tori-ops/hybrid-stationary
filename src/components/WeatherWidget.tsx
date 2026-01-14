'use client';

import { useState, useEffect } from 'react';

interface WeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
  };
}

export default function WeatherWidget({
  latitude,
  longitude,
  city,
  secondaryColor = '#274E13',
  accentColor = '#db2777',
}: {
  latitude: number;
  longitude: number;
  city: string;
  secondaryColor?: string;
  accentColor?: string;
}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using Open-Meteo API (free, no API key needed)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max&temperature_unit=fahrenheit&timezone=auto`
        );

        if (!response.ok) throw new Error('Failed to fetch weather');

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError('Unable to load weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  const getWeatherDescription = (code: number): string => {
    // WMO Weather interpretation codes
    if (code === 0) return 'Clear';
    if (code === 1 || code === 2) return 'Cloudy';
    if (code === 3) return 'Overcast';
    if (code === 45 || code === 48) return 'Foggy';
    if (code === 51 || code === 53 || code === 55) return 'Drizzle';
    if (code === 61 || code === 63 || code === 65) return 'Rain';
    if (code === 71 || code === 73 || code === 75) return 'Snow';
    return 'Mixed';
  };

  const getWeatherIcon = (code: number): string => {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code === 51 || code === 53 || code === 55) return '🌧️';
    if (code === 61 || code === 63 || code === 65) return '🌧️';
    if (code === 71 || code === 73 || code === 75) return '❄️';
    return '🌤️';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
        <p className="text-gray-600 text-center">Loading weather...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
        <p className="text-red-600 text-center">{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  const dailyData = weather.daily;

  return (
    <div className="w-full">
      <div className="rounded-lg shadow-lg p-6 mb-6" style={{
        background: `linear-gradient(135deg, white, rgba(39, 78, 19, 0.05))`,
        borderLeft: `4px solid ${secondaryColor}`
      }}>
        <h3 className="text-2xl font-serif mb-2" style={{ color: accentColor }}>{city} Weather Forecast</h3>
        <p style={{ color: accentColor, opacity: 0.9 }}>7-Day Outlook</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {dailyData.time.slice(0, 7).map((date, index) => (
          <div
            key={date}
            className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow"
          >
            <p className="text-sm font-semibold mb-2" style={{ color: accentColor }}>
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>

            <div className="text-3xl my-2">
              {getWeatherIcon(dailyData.weathercode[index])}
            </div>

            <p className="text-xs mb-3" style={{ color: accentColor }}>
              {getWeatherDescription(dailyData.weathercode[index])}
            </p>

            <div className="border-t pt-3">
              <div className="flex justify-center gap-2 text-sm">
                <span className="font-semibold" style={{ color: accentColor }}>
                  {Math.round(dailyData.temperature_2m_max[index])}°F
                </span>
                <span style={{ color: accentColor }}>
                  {Math.round(dailyData.temperature_2m_min[index])}°F
                </span>
              </div>
              <p className="text-xs mt-1" style={{ color: accentColor }}>
                Wind: {Math.round(dailyData.windspeed_10m_max[index])} mph
              </p>
              {dailyData.precipitation_sum[index] > 0 && (
                <p className="text-xs mt-1" style={{ color: accentColor }}>
                  💧 {dailyData.precipitation_sum[index].toFixed(1)}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
