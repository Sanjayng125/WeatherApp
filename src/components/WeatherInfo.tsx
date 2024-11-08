import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import FeatherIcons from 'react-native-vector-icons/Feather';

export default function WeatherInfo({
  data,
  kelvin,
}: {
  data: {
    weatherImage: ImageSourcePropType;
    temperature: string;
    maxTemperature: string;
    minTemperature: string;
    windSpeed: string;
    humidity: string;
  };
  kelvin?: boolean;
}) {
  const {
    weatherImage,
    temperature,
    maxTemperature,
    minTemperature,
    windSpeed,
    humidity,
  } = data;

  return (
    <>
      <View style={styles.weatherInfoContainer}>
        <Image source={weatherImage} style={styles.weatherImage} />
        <Text style={styles.mainTempText}>
          {kelvin ? (Number(temperature) - 273.15).toFixed(1) : temperature}°C
        </Text>
        <View style={styles.tempContainer}>
          <Text style={styles.tempText}>
            Max{' '}
            {kelvin
              ? (Number(maxTemperature) - 273.15).toFixed(1)
              : maxTemperature}
            °C
          </Text>
          <Text style={styles.tempText}>
            Min{' '}
            {kelvin
              ? (Number(minTemperature) - 273.15).toFixed(1)
              : minTemperature}
            °C
          </Text>
        </View>
      </View>

      <View style={styles.extraInfoContainer}>
        <View style={styles.windContainer}>
          <FeatherIcons name="wind" size={30} color="white" />
          <Text style={styles.windText}>{windSpeed} m/s</Text>
        </View>
        <View style={styles.humidityContainer}>
          <FeatherIcons name="droplet" size={30} color="white" />
          <Text style={styles.humidityText}>{humidity}%</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  weatherInfoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  weatherImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
  },
  mainTempText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  tempContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  tempText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  extraInfoContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  windContainer: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 10,
  },
  windText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  humidityContainer: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    gap: 10,
    padding: 10,
    borderRadius: 10,
  },
  humidityText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
