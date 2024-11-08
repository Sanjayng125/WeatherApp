declare module '*.png';
declare module '*.webp';

interface Coordinates {
    latitude: number;
    longitude: number;
}

interface WeatherDataResponse {
    coord: {
        lon: number;
        lat: number;
    };
    weather: [{
        id: number;
        main: string;
        description: string;
        icon: string;
    }];
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
    };
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

interface WeatherData {
    main: string;
    description: string;
    weatherImage: ImageSourcePropType | null;
    temperature: string;
    maxTemperature: string;
    minTemperature: string;
    windSpeed: string;
    humidity: string;
    city: string;
    country: string;
}

interface WeatherForcast {
    dt: number;
    dt_txt: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
    };
    sys: {
        pod: string
    };
    visibility: number;
    weather: [{
        id: number;
        main: string;
        description: string;
        icon: string;
    }];
    wind: {
        speed: number;
        deg: number;
    };
}

interface WeatherForcastResponse {
    cod: string;
    message: number;
    cnt: number;
    list: WeatherForcast[];
}