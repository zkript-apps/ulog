import React from 'react';
import NavigationStack from './src/NavigationStack';
import { PortalProvider } from '@gorhom/portal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView className="flex-1">
      <PortalProvider>
        <NavigationStack />
      </PortalProvider>
    </GestureHandlerRootView>
  );
};

export default App;
