import React, { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, Text, ToastAndroid, PermissionsAndroid } from 'react-native';
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
  const [isPermissionAllowed, setIsPermissionAllowed] = useState(false);
  const { addNewAttendance } = useAttendance();
  const route = useRoute();
  const { classId, className } = route.params as any;
  const onSuccess = (e: any) => {
    setStatus(false);
    if (String(e.data).length <= 12 && !isValidUrl(e.data)) {
      addNewAttendance(classId, String(e.data), className);
    } else {
      showToast(`"${String(e.data)}" is an invalid Student Number`);
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
  const requestPermission = async (
    resultCamera: boolean,
    resultSMS: boolean,
  ) => {
    try {
      if (!resultCamera && !resultSMS) {
        const grantedCamera = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
          const grantedSMS = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.SEND_SMS,
          );
          if (grantedSMS) {
            setIsPermissionAllowed(true);
          }
        } else {
          showToast(
            'You cannot use this app effectively without those permission',
          );
        }
      } else if (!resultCamera && resultSMS) {
        const grantedCamera = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        if (grantedCamera === PermissionsAndroid.RESULTS.GRANTED) {
          setIsPermissionAllowed(true);
        } else {
          showToast(
            'You cannot use this app effectively without the camera permission',
          );
        }
      } else if (resultCamera && !resultSMS) {
        const grantedSMS = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.SEND_SMS,
        );
        if (grantedSMS === PermissionsAndroid.RESULTS.GRANTED) {
          setIsPermissionAllowed(true);
        } else {
          showToast(
            'You cannot use this app effectively without the sms permission',
          );
        }
      }
    } catch (err) {
      showToast(('SMS Permission: ' + err) as string);
    }
  };
  const checkPermission = useCallback(async () => {
    const resultCamera = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    const resultSMS = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
    );
    if (!resultCamera || !resultSMS) {
      requestPermission(resultCamera, resultSMS);
    } else {
      setIsPermissionAllowed(true);
    }
  }, []);
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);
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
      {isPermissionAllowed ? (
        <View className="mt-20">
          <QRCodeScanner
            onRead={onSuccess}
            flashMode={RNCamera.Constants.FlashMode.torch}
            reactivate={true}
            reactivateTimeout={delay}
            showMarker={true}
          />
        </View>
      ) : (
        <Text className="mx-3 text-gray-500 italic mt-5">
          In order for the camera to show, please allowed the permission for
          Camera and SMS
        </Text>
      )}
    </View>
  );
};

export default ScanClass;
