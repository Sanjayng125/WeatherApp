import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootParamsList} from '../../App';
import {useNavigation} from '@react-navigation/native';

type LocationProps = NativeStackNavigationProp<RootParamsList, 'Home'>;

export default function Location({
  city,
  country,
  setWeatherData,
}: {
  city: string;
  country: string;
  setWeatherData?: (data: WeatherData | null) => void;
}) {
  const {navigate} = useNavigation<LocationProps>();
  return (
    <View style={styles.locationContainer}>
      <TouchableOpacity
        style={styles.locationInnerContainer}
        onPress={() => {
          if (setWeatherData) {
            setWeatherData(null);
            return;
          }
          navigate('Search');
        }}>
        <EvilIcons name="location" size={32} color="white" />
        <Text style={styles.locationText}>
          {city}, {country}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    gap: 5,
    paddingHorizontal: 10,
  },
  locationInnerContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 10,
  },
  locationText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
