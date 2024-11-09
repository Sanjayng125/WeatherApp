import {FlatList, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {WEATHER_CONDITIONS} from '../constants/WeatherConditions';
import {formatDateManually, initWeatherImage} from '../utils';

export default function Forecast({forecast}: {forecast: WeatherForcast[]}) {
  return (
    <View style={styles.forcastContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.today}>Today</Text>
        <Text style={styles.todayDate}>{formatDateManually(new Date())}</Text>
      </View>
      <View style={styles.forcastListContainer}>
        <FlatList
          data={forecast.filter(
            item =>
              item.dt_txt.slice(0, 10) ===
              new Date().toISOString().slice(0, 10),
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.forcastCard}>
              <Image
                source={initWeatherImage(item.weather[0].main)}
                style={styles.forcastImage}
              />
              <Text style={styles.forcastTempText}>
                {(Number(item.main.temp) - 273.15).toFixed(1)}°C
              </Text>
              <Text style={styles.forcastDateText}>
                {item.dt_txt.split(' ')[1].slice(0, 5)}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  forcastContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
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
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
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
