import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AntIcons from 'react-native-vector-icons/AntDesign';

export default function SearchBar({
  search,
  setSearch,
  getWeather,
}: {
  search: string;
  setSearch: (val: string) => void;
  getWeather: () => void;
}) {
  return (
    <View style={styles.searchBarContainer}>
      <TextInput
        placeholder="Search for a city"
        style={styles.searchBar}
        value={search}
        onChangeText={text => setSearch(text)}
      />
      <TouchableOpacity
        style={styles.searchBtn}
        onPress={() => {
          getWeather();
          setSearch('');
        }}>
        <AntIcons name="search1" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    fontSize: 20,
    color: 'white',
  },
  searchBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
});
