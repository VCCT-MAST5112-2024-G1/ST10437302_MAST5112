import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuScreen from './screens/MenuScreen';
import FilterScreen from './screens/FilterScreen';
import AddDishScreen from './screens/AddDishScreen';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen 
          name="Menu" 
          component={MenuScreen}  // Pass the component directly
          options={{ title: 'Menu' }}
        />
        <Stack.Screen 
          name="FilterScreen" 
          component={FilterScreen}  // Pass the component directly
          options={{ title: 'Filter Dishes' }}
        />
        <Stack.Screen 
          name="AddDishScreen" 
          component={AddDishScreen}  // Pass the component directly
          options={{ title: 'Add Dish' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
