import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {request, PERMISSIONS, PermissionStatus} from 'react-native-permissions';
import {API_KEY} from '../API';
import LinearGradient from 'react-native-linear-gradient';
import WeatherInfo from '../components/WeatherInfo';
import Location from '../components/Location';
import {initWeatherImage} from '../utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native';
import Forecast from '../components/Forecast';
import FiveDayForecast from '../components/FiveDayForecast';

const HomeScreen: React.FC = () => {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [locationPermissionError, setLocationPermissionError] = useState<
    string | null
  >(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState<boolean>(false);

  const [forecast, setForecast] = useState<WeatherForcast[]>([]);

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const requestLocationPermission = async () => {
    setLocationError(null);
    setLocationPermissionError(null);
    setError(null);
    setWeatherData(null);
    setFetchingLocation(true);
    setRefreshing(true);
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
          },
          error => {
            setLocationError('Error getting location');
          },
          {enableHighAccuracy: false, timeout: 40000, maximumAge: 1000},
        );
      } else {
        setLocationPermissionError('Location permission denied');
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setLocationPermissionError('Error requesting location permission');
    } finally {
      setFetchingLocation(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const getWeatherByCoordinates = async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location?.latitude}&lon=${location?.longitude}&appid=${API_KEY}&units=metric`;

    setError(null);

    try {
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

      getWeatherForcastByCoordinates();
    } catch (error) {
      setError('Error fetching weather data');
    }
  };

  const getWeatherForcastByCoordinates = async () => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location?.latitude}&lon=${location?.longitude}&appid=${API_KEY}`;

    setError(null);

    try {
      const response = await fetch(url);
      const resData: WeatherForcastResponse = await response.json();

      if (resData.list.length > 0) {
        setForecast(resData.list);
      }

      setError(null);
    } catch (error) {
      setError('Error fetching weather forcast data');
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
      {!error && !locationError && !locationPermissionError && !weatherData && (
        <View style={styles.loader}>
          <ActivityIndicator size={100} color={'white'} />
        </View>
      )}
      {fetchingLocation && (
        <Text style={styles.fetchingLocationText}>
          Fetching current location...
        </Text>
      )}
      {(error || locationError || locationPermissionError) && !weatherData && (
        <View style={styles.errorContainer}>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (locationError) {
                requestLocationPermission();
              } else {
                getWeatherByCoordinates();
              }
            }}>
            <Text style={styles.retryButtonText}>Try again</Text>
            <MaterialIcons name="restart-alt" size={28} color={'white'} />
          </TouchableOpacity>
          {locationError && (
            <Text style={styles.errorText}>{locationError}</Text>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          {locationPermissionError && (
            <>
              <Text style={styles.errorText}>{locationPermissionError}</Text>
              <Text style={styles.errorText}>
                Please allow location permission to get your current location
                weather
              </Text>
            </>
          )}
          {(locationError || locationPermissionError) && (
            <Text style={styles.errorText}>
              You can see other places weather by searching for a city
            </Text>
          )}
        </View>
      )}
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={requestLocationPermission}
          />
        }
        showsVerticalScrollIndicator={false}>
        {/* Main */}
        {location && weatherData && (
          <View style={styles.mainWeatherContainer}>
            <Location city={weatherData.city} country={weatherData.country} />
            <WeatherInfo data={weatherData} />
            {forecast && <Forecast forecast={forecast} />}
            {forecast && <FiveDayForecast forecast={forecast} />}
          </View>
        )}
      </ScrollView>
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
    left: Dimensions.get('window').width / 2 - 50,
    zIndex: 100,
    top: Dimensions.get('window').height / 2 - 100,
  },
  mainWeatherContainer: {
    width: '100%',
    flex: 1,
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
  retryButton: {
    borderColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  fetchingLocationText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
