import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screen/AuthScreen';
import TasksScreen from './screen/TasksScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="ScreenOne" 
          component={TasksScreen} 
          options={{ title: 'Tasks' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
