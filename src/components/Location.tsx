import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';

export default function Location({
  city,
  country,
  setWeatherData,
  getWeatherData,
}: {
  city: string;
  country: string;
  setWeatherData?: (data: WeatherData | null) => void;
  getWeatherData?: () => void;
}) {
  return (
    <View style={styles.locationContainer}>
      <View style={styles.locationInnerContainer}>
        <EvilIcons name="location" size={32} color="white" />
        <Text style={styles.locationText}>
          {city}, {country}
        </Text>
        {(setWeatherData || getWeatherData) && (
          <TouchableOpacity
            style={{
              borderLeftWidth: 2,
              borderLeftColor: 'white',
              marginLeft: 10,
              paddingLeft: 10,
            }}
            onPress={() => {
              if (setWeatherData) {
                setWeatherData(null);
              }
              if (getWeatherData) {
                getWeatherData();
              }
            }}>
            {setWeatherData && !getWeatherData ? (
              <FeatherIcons name="x" size={28} color="white" />
            ) : (
              <FeatherIcons name="refresh-cw" size={28} color="white" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
  },
  locationInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 5,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  locationText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
