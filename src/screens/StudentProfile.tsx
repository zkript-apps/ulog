import React from 'react';
import { View, Text } from 'react-native';
import PageHeader from '../components/PageHeader';
import { useRoute } from '@react-navigation/native';

const StudentProfile = () => {
  const route = useRoute();
  const { firstName, lastName, guardianPhoneNumber, studentNumber } =
    route.params as any;
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
    </View>
  );
};

export default StudentProfile;
