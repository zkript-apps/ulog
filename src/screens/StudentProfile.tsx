import React, { useState } from 'react';
import { View, Text, Button, ToastAndroid } from 'react-native';
import PageHeader from '../components/PageHeader';
import { useRoute, useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import RNFS from 'react-native-fs';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

const StudentProfile = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const [qrCode, setQrCode] = useState<any>(null);
  const { firstName, lastName, guardianPhoneNumber, studentNumber, id } =
    route.params as any;
  const downloadQRCode = () => {
    qrCode.toDataURL((data: any) => {
      RNFS.writeFile(
        `${RNFS.CachesDirectoryPath}/${firstName}-${lastName}-qr.png"`,
        data,
        'base64',
      )
        .then(() => {
          return CameraRoll.save(
            `${RNFS.CachesDirectoryPath}/${firstName}-${lastName}-qr.png"`,
            { type: 'photo' },
          );
        })
        .then(() => {
          ToastAndroid.show(
            `${firstName} ${lastName}'s QR was saved to gallery`,
            ToastAndroid.SHORT,
          );
        });
    });
  };
  return (
    <View>
      <PageHeader title="Student Profile" leftButtonText="Back" />
      <View className="bg-white py-3 px-3 my-1 mx-2 rounded-md">
        <Text className="text-gray-500 text-xs">Full Name</Text>
        <Text className="text-black font-bold">
          {firstName} {lastName}
        </Text>
      </View>
      <View className="bg-white py-3 px-3 my-1 mx-2 rounded-md">
        <Text className="text-gray-500 text-xs">Student Number</Text>
        <Text className="text-black font-bold">{studentNumber}</Text>
      </View>
      <View className="bg-white py-3 px-3 my-1 mx-2 rounded-md">
        <Text className="text-gray-500 text-xs">Guardian Phone Number</Text>
        <Text className="text-black font-bold">{guardianPhoneNumber}</Text>
      </View>
      <View className="my-1 mx-2">
        <Button
          onPress={() => {
            navigation.navigate({
              name: 'StudentAttendance',
              params: {
                studentId: id,
                lastName: lastName,
              },
            });
          }}
          title="Attendance Lists"
          color="#ffae00"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
      <View className="my-1 mx-2">
        <Button
          onPress={downloadQRCode}
          title="Download QR Code"
          color="#4994ff"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
      <View className="my-1 mx-2">
        <QRCode
          value={studentNumber}
          logoBackgroundColor="transparent"
          getRef={c => setQrCode(c)}
        />
      </View>
    </View>
  );
};

export default StudentProfile;
