import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {API_KEY} from '../API';
import LinearGradient from 'react-native-linear-gradient';
import Forcast from '../components/Forecast';
import WeatherInfo from '../components/WeatherInfo';
import Location from '../components/Location';
import {initWeatherImage} from '../utils';
import SearchBar from '../components/SearchBar';
import FiveDayForecast from '../components/FiveDayForecast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntIcons from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SearchScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [forecast, setForecast] = useState<WeatherForcast[]>([]);

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [history, setHistory] = useState<string[]>([]);

  const getWeather = async (historySearch?: string) => {
    if (search.trim() === '' && !historySearch) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${
      historySearch ? historySearch : search.trim()
    }&appid=${API_KEY}`;
    setError(null);
    try {
      setIsLoading(true);
      setRefreshing(true);
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

      if (!history.includes(search.toLowerCase().trim()) && !historySearch) {
        const newHistory = [...history, search.toLowerCase().trim()];
        setHistory(newHistory);
        saveHistory(newHistory);
      }

      getWeatherForcast(resData.coord);
    } catch (error) {
      setError('Error fetching weather data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const getWeatherForcast = async (location: {lat: number; lon: number}) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}`;

    setError(null);

    try {
      setIsLoading(true);
      const response = await fetch(url);
      const resData: WeatherForcastResponse = await response.json();

      if (resData.list.length > 0) {
        setForecast(resData.list);
      }
    } catch (error) {
      setError('Error fetching weather forcast data');
    } finally {
      setIsLoading(false);
    }
  };

  const getHistory = async () => {
    const res = await AsyncStorage.getItem('history');

    if (res) {
      setHistory(JSON.parse(res));
    }
  };

  const saveHistory = async (history: string[]) => {
    await AsyncStorage.setItem('history', JSON.stringify(history));
  };

  useEffect(() => {
    getHistory();
  }, []);

  const removeHistory = async (item: string) => {
    const newHistory = history.filter(i => i !== item);
    setHistory(newHistory);
    saveHistory(newHistory);
  };

  return (
    <LinearGradient colors={['#250046', '#7f60d4']} style={styles.container}>
      {isLoading && (
        <ActivityIndicator size={100} color={'white'} style={styles.loader} />
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
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={getWeather} />
        }
        showsVerticalScrollIndicator={false}>
        {/* Main */}
        <View style={styles.mainWeatherContainer}>
          {!weatherData && (
            <SearchBar
              search={search}
              setSearch={setSearch}
              getWeather={getWeather}
            />
          )}

          {!error && !weatherData && !isLoading && history.length === 0 && (
            <Text style={[styles.text, {textAlign: 'center'}]}>
              Search for a city to see weather
            </Text>
          )}
          {!error && !weatherData && !isLoading && history.length && (
            <View style={styles.historyContainer}>
              <Text style={styles.text}>History</Text>
              {history.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.historyItem}
                  onPress={() => getWeather(item)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                    }}>
                    <MaterialIcons name="history" size={30} color="black" />
                    <Text style={styles.historyText}>{item}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      removeHistory(item);
                    }}>
                    <AntIcons
                      name="closecircleo"
                      size={30}
                      color="black"
                      style={styles.historyIcon}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
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
              {forecast && <FiveDayForecast forecast={forecast} />}
            </>
          )}
        </View>
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
  historyContainer: {
    paddingTop: 10,
  },
  historyItem: {
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 5,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  historyText: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 1,
  },
  historyIcon: {
    padding: 1,
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
  errorText: {
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorImageContainer: {
    position: 'absolute',
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
    fontWeight: 'bold',
    margin: 10,
  },
});

export default SearchScreen;
