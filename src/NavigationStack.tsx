import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import AddClassScreen from './screens/AddClass';
import EditClassScreen from './screens/EditClass';
import ClassStudentsScreen from './screens/ClassStudents';
import AddStudentScreen from './screens/AddStudent';
import EditStudentScreen from './screens/EditStudent';
import PickStudentScreen from './screens/PickStudent';

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
        <Screen name="EditClass" component={EditClassScreen} />
        <Screen name="ClassStudents" component={ClassStudentsScreen} />
        <Screen name="AddStudent" component={AddStudentScreen} />
        <Screen name="EditStudent" component={EditStudentScreen} />
        <Screen name="PickStudent" component={PickStudentScreen} />
      </Navigator>
    </NavigationContainer>
  );
};

export default NavigationStack;
