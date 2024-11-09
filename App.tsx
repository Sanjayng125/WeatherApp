import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screen/HomeScreen';
import SearchScreen from './src/screen/SearchScreen';
import AntIcons from 'react-native-vector-icons/AntDesign';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export type RootParamsList = {
  Home: undefined;
  Search: undefined;
};

const Tab = createBottomTabNavigator<RootParamsList>();
const Stack = createNativeStackNavigator<RootParamsList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={'#250046'} />
      {/* <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#250046',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarActiveTintColor: '#4400ff',
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: e => (
              <AntIcons
                name="home"
                size={30}
                color={e.focused ? '#4400ff' : 'white'}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: e => (
              <AntIcons
                name="search1"
                size={30}
                color={e.focused ? '#4400ff' : 'white'}
              />
            ),
          }}
        />
      </Tab.Navigator> */}
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            headerTintColor: '#4400ff',
          }}
        />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
