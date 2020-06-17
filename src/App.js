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
import Login from './Components/pages/Login';
import Profile_edit from './Components/pages/Profile_edit';
import HomeScreen from './Components/pages/HomeScreen';
import Main from './Components/pages/Main';
import Profile from './Components/pages/Profile';
import List_users from './Components/pages/List_users';
import Select_ban from './Components/pages/Select_ban';
import Person_historys from './Components/pages/Person_historys';
import Persons from './Components/pages/Persons';
import Local_calendars from './Components/pages/Local_calendars';
import Local_historys from './Components/pages/Local_historys';



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
                    options={{ title: 'โปรไฟล์', headerLeft: null }}
                />
                <Stack.Screen
                    name="Main"
                    component={Main}
                    options={{ title: 'หน้าหลัก', headerShown: false, }}
                />
                <Stack.Screen
                    name="Profile"
                    component={Profile}
                    options={{ title: 'โปรไฟล์', headerLeft: null }}
                />
                <Stack.Screen
                    name="List_users"
                    component={List_users}
                    options={{ title: 'ทำเนียบ', headerShown: false, }}
                />
                <Stack.Screen
                    name="Select_ban"
                    component={Select_ban}
                    options={{ title: 'เลือกหมู่บ้าน', headerLeft: null }}
                />
                <Stack.Screen
                    name="Local_calendars"
                    component={Local_calendars}
                    options={{ title: 'ปฏิทินชุมชุน', headerLeft: null }}
                />
                <Stack.Screen
                    name="Local_historys"
                    component={Local_historys}
                    options={{ title: 'ประวัติศาสตร์ชุมชน', headerLeft: null }}
                />
                <Stack.Screen
                    name="Persons"
                    component={Persons}
                    options={{ title: 'ประวัติบุคคลที่น่าสนใจในชุมชน', headerLeft: null }}
                />
                <Stack.Screen
                    name="Person_historys"
                    component={Person_historys}
                    options={{ title: 'ประวัติบุคคลที่น่าสนใจ', headerLeft: null }}
                />


            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
