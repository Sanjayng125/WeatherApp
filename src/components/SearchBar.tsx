import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import React from 'react';
import AntIcons from 'react-native-vector-icons/AntDesign';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootParamsList} from '../../App';
import {useNavigation} from '@react-navigation/native';

type SearchBarProps = NativeStackNavigationProp<RootParamsList, 'Home'>;

export default function SearchBar({
  search,
  setSearch,
  getWeather,
}: {
  search: string;
  setSearch: (val: string) => void;
  getWeather: () => void;
}) {
  const {popToTop} = useNavigation<SearchBarProps>();

  return (
    <View style={styles.searchBarContainer}>
      <TouchableOpacity onPress={popToTop}>
        <AntIcons name="arrowleft" size={30} color="white" />
      </TouchableOpacity>
      <TextInput
        onSubmitEditing={() => {
          if (search.trim() !== '') {
            getWeather();
            setSearch('');
          }
        }}
        placeholder="Search for a city"
        style={styles.searchBar}
        value={search}
        onChangeText={text => setSearch(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  searchBar: {
    flex: 1,
    padding: 10,
    marginHorizontal: 10,
    fontSize: 20,
    color: 'white',
  },
  searchBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
  },
});
