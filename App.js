/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// pages
import Login from './src/Components/pages/Login';
import Profile_edit from './src/Components/pages/Profile_edit';
import HomeScreen from './src/Components/pages/HomeScreen';
import Main from './src/Components/pages/Main';



const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        headerMode="screen"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: '#4050b5' }, headerTitleAlign: 'center', headerTitleAllowFontScaling: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'PEDUbon', headerShown: false, }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: 'เข้าสู่ระบบ', headerShown: false, }}
        />
        <Stack.Screen
          name="Profile_edit"
          component={Profile_edit}
          options={{ title: 'โปรไฟล์', }}
        />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{ title: 'หน้าหลัก', headerShown: false, }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
