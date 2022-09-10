import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ClassesScreen from './screens/Classes';
import ScanScreen from './screens/Scan';
import VectorIcon from './components/VectorIcon';
import { Text } from 'react-native';

const { Navigator, Screen } = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Screen
        name="Class"
        component={ClassesScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <>
                <VectorIcon
                  name="people"
                  color={focused ? '#3ABFF8' : '#c9c9c9'}
                  size={22}
                />
                <Text
                  className={`text-[11px] ${
                    focused ? 'text-[#3ABFF8]' : 'text-[#c9c9c9]'
                  }`}
                >
                  Classes
                </Text>
              </>
            );
          },
        }}
      />
      <Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <>
                <VectorIcon
                  name="qr-code"
                  color={focused ? '#3ABFF8' : '#c9c9c9'}
                  size={22}
                />
                <Text
                  className={`text-[11px] ${
                    focused ? 'text-[#3ABFF8]' : 'text-[#c9c9c9]'
                  }`}
                >
                  Scan
                </Text>
              </>
            );
          },
        }}
      />
    </Navigator>
  );
}

export default BottomTabs;
