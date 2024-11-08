import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {request, PERMISSIONS, PermissionStatus} from 'react-native-permissions';
import {API_KEY} from '../API';
import LinearGradient from 'react-native-linear-gradient';
import Forcast from '../components/Forcast';
import WeatherInfo from '../components/WeatherInfo';
import Location from '../components/Location';
import {initWeatherImage} from '../utils';

const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationPermissionError, setLocationPermissionError] = useState<
    string | null
  >(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [forecast, setForecast] = useState<WeatherForcast[]>([]);

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const requestLocationPermission = async () => {
    setLocationError(null);
    setLocationPermissionError(null);
    try {
      const permission: PermissionStatus = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );

      if (permission === 'granted') {
        Geolocation.getCurrentPosition(
          (position: GeolocationResponse) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            getWeatherByCoordinates();
            getWeatherForcastByCoordinates();
          },
          error => {
            console.error('Error getting location:', error);
            setLocationError('Error getting location');
          },
          {enableHighAccuracy: true, timeout: 40000, maximumAge: 1000},
        );
      } else {
        setLocationPermissionError('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermissionError('Error requesting location permission');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const getWeatherByCoordinates = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location?.latitude}&lon=${location?.longitude}&appid=${API_KEY}&units=metric`;

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

      setError(null);
    } catch (error) {
      setError('Error fetching weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherForcastByCoordinates = async () => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location?.latitude}&lon=${location?.longitude}&appid=${API_KEY}`;

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

  useEffect(() => {
    if (location && !weatherData) {
      getWeatherByCoordinates();
      getWeatherForcastByCoordinates();
    }
  }, [location, weatherData]);

  return (
    <LinearGradient colors={['#250046', '#7f60d4']} style={styles.container}>
      {isLoading && (
        <ActivityIndicator size={100} color={'white'} style={styles.loader} />
      )}
      {(error || locationError || locationPermissionError) && (
        <View style={styles.errorContainer}>
          {locationError && (
            <Text style={styles.errorText}>{locationError}</Text>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {locationPermissionError && (
            <Text style={styles.errorText}>{locationPermissionError}</Text>
          )}
          {(locationError || locationPermissionError) && (
            <Text style={styles.errorText}>
              You can see other places weather by searching for a city
            </Text>
          )}
        </View>
      )}

      {/* Main */}
      {location && weatherData && !isLoading && (
        <View style={styles.mainWeatherContainer}>
          <Location city={weatherData.city} country={weatherData.country} />
          <WeatherInfo data={weatherData} />
          {forecast && <Forcast forecast={forecast} />}
        </View>
      )}
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
});

export default HomeScreen;
