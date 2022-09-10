import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import AddClassScreen from './screens/AddClass';
import ClassStudents from './screens/ClassStudents';
import AddClassStudent from './screens/AddClassStudent';

const { Navigator, Screen } = createNativeStackNavigator();

const NavigationStack = () => {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Account"
      >
        <Screen name="Account" component={BottomTabs} />
        <Screen name="AddClass" component={AddClassScreen} />
        <Screen name="ClassStudents" component={ClassStudents} />
        <Screen name="AddClassStudent" component={AddClassStudent} />
      </Navigator>
    </NavigationContainer>
  );
};

export default NavigationStack;
