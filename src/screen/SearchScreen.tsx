import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Image} from 'react-native';
import {API_KEY} from '../API';
import LinearGradient from 'react-native-linear-gradient';
import Forcast from '../components/Forcast';
import WeatherInfo from '../components/WeatherInfo';
import Location from '../components/Location';
import {initWeatherImage} from '../utils';
import SearchBar from '../components/SearchBar';

const SearchScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [forecast, setForecast] = useState<WeatherForcast[]>([]);

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const getWeather = async () => {
    if (search.trim() === '') return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${search.trim()}&appid=${API_KEY}`;
    setError(null);
    try {
      setIsLoading(true);
      const response = await fetch(url);
      const resData: WeatherDataResponse = await response.json();

      setWeatherData({
        main: resData.weather[0].main,
        description: resData.weather[0].description,
        weatherImage: initWeatherImage(resData.weather[0].main),
        temperature: resData.main.temp.toFixed(1),
        maxTemperature: resData.main.temp_max.toFixed(1),
        minTemperature: resData.main.temp_min.toFixed(1),
        windSpeed: resData.wind.speed.toFixed(1),
        humidity: resData.main.humidity.toFixed(1),
        city: resData.name,
        country: resData.sys.country,
      });

      getWeatherForcast(resData.coord);
      setError(null);
    } catch (error) {
      setError('Error fetching weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherForcast = async (location: {lat: number; lon: number}) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;

    try {
      setIsLoading(true);
      const response = await fetch(url);
      const resData: WeatherForcastResponse = await response.json();

      if (resData.list.length > 0) {
        setForecast(resData.list);
      }

      setError(null);
    } catch (error) {
      setError('Error fetching weather forcast data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#250046', '#7f60d4']} style={styles.container}>
      {isLoading && (
        <ActivityIndicator size={100} color={'white'} style={styles.loader} />
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Main */}
      <View style={styles.mainWeatherContainer}>
        {!weatherData && (
          <SearchBar
            search={search}
            setSearch={setSearch}
            getWeather={getWeather}
          />
        )}
        {error && (
          <View style={styles.errorImageContainer}>
            <Image
              source={require('../assets/images/location-not-found.webp')}
              style={styles.errorImage}
            />
            <Text style={[styles.errorText, {fontSize: 20}]}>
              Location not found or cannot be reached!
            </Text>
          </View>
        )}
        {!error && !weatherData && !isLoading && (
          <Text style={styles.text}>Search for a city to see weather</Text>
        )}
        {weatherData && !isLoading && (
          <>
            <Location
              city={weatherData.city}
              country={weatherData.country}
              setWeatherData={setWeatherData}
            />
            <WeatherInfo data={weatherData} kelvin={true} />
            {forecast && <Forcast forecast={forecast} />}
          </>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  loader: {
    position: 'absolute',
    top: '40%',
  },
  mainWeatherContainer: {
    justifyContent: 'space-between',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorImage: {
    width: '80%',
    resizeMode: 'contain',
  },
  text: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});

export default SearchScreen;
