import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WEATHER_CONDITIONS} from '../constants/WeatherConditions';
import {formatDateManually, initWeatherImage} from '../utils';

export default function FiveDayForecast({
  forecast,
}: {
  forecast: WeatherForcast[];
}) {
  const [forecastGroups, setForecastGroups] = useState<WeatherForcast[][]>([]);

  const groupedForecasts = forecast.reduce((acc, forecast) => {
    // Extract the date portion (e.g., "2024-11-10") from dt_txt
    const date = forecast.dt_txt.split(' ')[0];

    // Initialize the group if it doesn't exist
    if (!acc[date]) {
      acc[date] = [];
    }

    // Add the forecast to the corresponding date group
    acc[date].push(forecast);

    return acc;
  }, {} as Record<string, WeatherForcast[]>);

  useEffect(() => {
    setForecastGroups(Object.values(groupedForecasts));
  }, [forecast]);

  return (
    <View style={styles.forcastContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.today}>5 Day Forecast</Text>
      </View>
      {forecastGroups.slice(1).map((group, index) => (
        <View
          style={[
            styles.forcastListContainer,
            index > 0 && {
              borderTopWidth: 2,
              borderTopColor: 'white',
              paddingTop: 10,
            },
          ]}
          key={index}>
          <FlatList
            data={group.filter(
              item =>
                item.dt_txt.slice(0, 10) !==
                new Date().toISOString().slice(0, 10),
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <View style={styles.forcastCard} key={index}>
                <Image
                  source={initWeatherImage(item.weather[0].main)}
                  style={styles.forcastImage}
                />
                <Text style={styles.forcastTempText}>
                  {(Number(item.main.temp) - 273.15).toFixed(1)}°C
                </Text>
                <Text style={styles.forcastDateText}>
                  {new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(
                    new Date(item.dt_txt.split(' ')[0]),
                  )}
                </Text>
                <Text style={styles.forcastDateText}>
                  {item.dt_txt.split(' ')[1].slice(0, 5)}
                </Text>
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  forcastContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 10,
    marginHorizontal: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    marginBottom: 10,
    borderBottomColor: 'white',
  },
  today: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  todayDate: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  forcastListContainer: {
    marginTop: 10,
  },
  forcastCard: {
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 5,
  },
  forcastImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  forcastTempText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  forcastDateText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
