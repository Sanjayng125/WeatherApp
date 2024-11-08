import { WEATHER_CONDITIONS } from "../constants/WeatherConditions";

export const initWeatherImage = (main: string) => {
    switch (main) {
        case 'Clear':
            return WEATHER_CONDITIONS.Clear.imageUrl;
            break;
        case 'Clouds':
            return WEATHER_CONDITIONS.Clouds.imageUrl;
            break;
        case 'Rain':
            return WEATHER_CONDITIONS.Rain.imageUrl;
            break;
        case 'Thunderstorm':
            return WEATHER_CONDITIONS.Thunderstorm.imageUrl;
            break;
        case 'Drizzle':
            return WEATHER_CONDITIONS.Drizzle.imageUrl;
            break;
        case 'Snow':
            return WEATHER_CONDITIONS.Snow.imageUrl;
            break;
        case 'Mist':
            return WEATHER_CONDITIONS.Mist.imageUrl;
            break;
        case 'Smoke':
            return WEATHER_CONDITIONS.Smoke.imageUrl;
            break;
        case 'Haze':
            return WEATHER_CONDITIONS.Haze.imageUrl;
            break;
        case 'Fog':
            return WEATHER_CONDITIONS.Fog.imageUrl;
            break;
        case 'Tornado':
            return WEATHER_CONDITIONS.Tornado.imageUrl;
            break;
        default:
            return WEATHER_CONDITIONS.Clear.imageUrl;
            break;
    }
};

export const formatDateManually = (date: Date, showDay: boolean = true): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate().toString().padStart(2, '0');
    const monthName = months[date.getMonth()];

    return showDay ? `${dayName}, ${monthName}` : `${day}, ${monthName}`;
};