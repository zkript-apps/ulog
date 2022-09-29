import React from 'react';
import NavigationStack from './src/NavigationStack';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const App = () => {
  return (
    <BottomSheetModalProvider>
      <NavigationStack />
    </BottomSheetModalProvider>
  );
};

export default App;
