import React from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import PageHeader from '../components/PageHeader';
import useAttendance from '../hooks/useAttendance';

const ScanClass = () => {
  const { addNewAttendance } = useAttendance();
  const route = useRoute();
  const { classId, className } = route.params as any;
  const onSuccess = (e: any) => {
    addNewAttendance(classId, e.data);
  };
  return (
    <View>
      <PageHeader title="Scan QR Codes" />
      <Text className="mx-3 mt-3">
        You can now scan the QR Codes of {className} class.
      </Text>
      <View className="mt-20">
        <QRCodeScanner
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.torch}
          reactivate={true}
        />
      </View>
    </View>
  );
};

export default ScanClass;
