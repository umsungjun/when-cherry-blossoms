export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  precipitation: number;
  weathercode: number;
  is_day: number;
}

export interface DailyForecast {
  date: string;
  precipitationSum: number;
  precipitationHours: number;
  windspeedMax: number;
  windgustsMax: number;
  weathercode: number;
  tempMax: number;
  tempMin: number;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  timezone: string;
}

export type WeatherIcon =
  | "sunny"
  | "cloudy"
  | "rainy"
  | "snowy"
  | "foggy"
  | "thunderstorm"
  | "partly-cloudy";
