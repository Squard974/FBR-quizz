import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import LadderScreen from '../screens/LadderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AthletesScreen from '../screens/AthletesScreen';
import EndGameScreen from '../screens/EndGameScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="LoginScreen">
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="RegisterScreen"
                    component={RegisterScreen}
                    options={{ headerTitle: '' }}
                />
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LadderScreen"
                    component={LadderScreen}
                    options={{ headerTitle: 'Classement' }}
                />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen}  options={{ headerTitle: 'Profil' }}/>
                <Stack.Screen name="AthletesScreen" component={AthletesScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="EndGameScreen" component={EndGameScreen} options={{ headerShown: false }} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}
