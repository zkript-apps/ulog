import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, ToastAndroid } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import PageHeader from '../components/PageHeader';
import useAttendance from '../hooks/useAttendance';

const showToast = (value: string) => {
  ToastAndroid.showWithGravity(value, ToastAndroid.LONG, ToastAndroid.BOTTOM);
};

const ScanClass = () => {
  const delay = 3000;
  const [status, setStatus] = useState(true);
  const { addNewAttendance } = useAttendance();
  const route = useRoute();
  const { classId, className } = route.params as any;
  const onSuccess = (e: any) => {
    setStatus(false);
    if (String(e.data).length <= 12 && !isValidUrl(e.data)) {
      addNewAttendance(classId, String(e.data), className);
    } else {
      showToast('Invalid Student Number');
    }
    delayScanStatus();
  };
  const delayScanStatus = () => {
    setTimeout(function () {
      setStatus(true);
    }, delay);
  };
  const isValidUrl = (str: string) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(str);
  };

  return (
    <View>
      <PageHeader title="Scan QR Codes" />
      <Text className="mx-3 mt-2">
        You can now scan the QR Codes of{' '}
        <Text className="font-bold italic">{className}</Text> class
      </Text>
      <Text className="mx-3 mt-1">
        Scan Status:{' '}
        <Text
          className={`${status ? 'text-green-500' : 'text-red-500'} font-bold`}
        >
          {status ? 'Enabled' : 'Disabled'}
        </Text>
      </Text>
      <View className="mt-20">
        <QRCodeScanner
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.torch}
          reactivate={true}
          reactivateTimeout={delay}
        />
      </View>
    </View>
  );
};

export default ScanClass;
