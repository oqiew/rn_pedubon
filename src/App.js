/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
// import { decode, encode } from 'base-64';

// if (!global.btoa) { global.btoa = encode }

// if (!global.atob) { global.atob = decode }
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
import SocialMapsScreen from './screens/SocialMapsScreen';
import LocalCalendarScreen from './screens/LocalCalendarScreen';
import LocalHistoryScreen from './screens/LocalHistoryScreen';
import PersonHistoryScreen from './screens/PersonHistoryScreen';
import PersonsScreen from './screens/PersonsScreen';
import NewProfileScreen from './screens/profile/NewProfileScreen';
import { routeName } from './routes/RouteConstant'
import AddBanScreen from './screens/AddBanScreen';
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
                    name={routeName.Home}
                    component={HomeScreen}
                    options={{ title: 'PEDUbon', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.Register}
                    component={RegisterScreen}
                    options={{ title: 'สมัครสมาชิก', headerShown: false, }}
                />

                <Stack.Screen
                    name={routeName.Main}
                    component={MainScreen}
                    options={{ title: 'หน้าหลัก', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.Profile}
                    component={ProfileScreen}
                    options={{ title: 'โปรไฟล์', headerShown: false, }}
                />
                <Stack.Screen
                    name={routeName.ListUser}
                    component={ListUserScreen}
                    options={{ title: 'ทำเนียบ', headerShown: false }}
                />
                <Stack.Screen
                    name={routeName.ProfileEdit}
                    component={ProfileEditScreen}
                    options={{ title: 'แก้ไขโปรไฟล์', headerShown: false }}
                />
                <Stack.Screen
                    name={routeName.NewProfile}
                    component={NewProfileScreen}
                    options={{ title: 'เพิ่มข้อมูลโปรไฟล์', headerShown: false }}
                />
                <Stack.Screen
                    name={routeName.Maps}
                    component={MapsScreen}
                    options={{ title: 'แผนที่ข้อมูล', headerShown: false }}
                />
                <Stack.Screen
                    name={routeName.SocialMaps}
                    component={SocialMapsScreen}
                    options={{ title: 'เพิ่มข้อมูลชุมชน', headerShown: false }}
                />
                <Stack.Screen
                    name={routeName.LocalCalendar}
                    component={LocalCalendarScreen}
                    options={{ title: 'ปฏิทินชุมชน', headerShown: false }}
                />
                <Stack.Screen
                    name={routeName.LocalHistory}
                    component={LocalHistoryScreen}
                    options={{ title: 'ประวัติศาสตร์ชุมชน', headerShown: false }}
                />
                <Stack.Screen
                    name={routeName.Persons}
                    component={PersonsScreen}
                    options={{ title: 'บุคคลที่น่าสนใจ', headerShown: false }}
                />
                <Stack.Screen
                    name={routeName.PersonHistory}
                    component={PersonHistoryScreen}
                    options={{ title: 'ประวัติบุคคลที่น่าสนใจ', headerShown: false }}
                />
                <Stack.Screen
                    name={routeName.AddBan}
                    component={AddBanScreen}
                    options={{ title: 'เพิ่มหมู่บ้าน', headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
