/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { decode, encode } from 'base-64';

if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// pages
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import MainScreen from './screens/MainScreen';
import ProfileScreen from './screens/ProfileScreen';
import ListUserScreen from './screens/ListUserScreen';
import ProfileEditScreen from './screens/ProfileEditScreen';
import MapsScreen from './screens/MapsScreen';
import SelectBanScreen from './screens/SelectBanScreen';
import SocialMapsScreen from './screens/SocialMapsScreen';
import LocalCalendarScreen from './screens/LocalCalendarScreen';
import LocalHistoryScreen from './screens/LocalHistoryScreen';
import PersonHistoryScreen from './screens/PersonHistoryScreen';
import PersonsScreen from './screens/PersonsScreen';
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
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: 'สมัครสมาชิก', headerShown: false, }}
                />

                <Stack.Screen
                    name="Main"
                    component={MainScreen}
                    options={{ title: 'หน้าหลัก', headerShown: false, }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ title: 'โปรไฟล์', headerShown: true, }}
                />
                <Stack.Screen
                    name="ListUser"
                    component={ListUserScreen}
                    options={{ title: 'ทำเนียบ', headerShown: true }}
                />
                <Stack.Screen
                    name="ProfileEdit"
                    component={ProfileEditScreen}
                    options={{ title: 'แก้ไขโปรไฟล์', headerShown: true }}
                />
                <Stack.Screen
                    name="Maps"
                    component={MapsScreen}
                    options={{ title: 'แผนที่ข้อมูล', headerShown: true }}
                />
                <Stack.Screen
                    name="SelectBan"
                    component={SelectBanScreen}
                    options={{ title: 'เลือกหมู่บ้าน', headerShown: true }}
                />
                <Stack.Screen
                    name="SocialMaps"
                    component={SocialMapsScreen}
                    options={{ title: 'เพิ่มข้อมูลชุมชน', headerShown: true }}
                />
                <Stack.Screen
                    name="LocalCalendar"
                    component={LocalCalendarScreen}
                    options={{ title: 'ปฏิทินชุมชน', headerShown: true }}
                />
                <Stack.Screen
                    name="LocalHistory"
                    component={LocalHistoryScreen}
                    options={{ title: 'ประวัติศาสตร์ชุมชน', headerShown: true }}
                />
                <Stack.Screen
                    name="Persons"
                    component={PersonsScreen}
                    options={{ title: 'บุคคลที่น่าสนใจ', headerShown: true }}
                />
                <Stack.Screen
                    name="PersonHistory"
                    component={PersonHistoryScreen}
                    options={{ title: 'ประวัติบุคคลที่น่าสนใจ', headerShown: true }}
                />



            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
