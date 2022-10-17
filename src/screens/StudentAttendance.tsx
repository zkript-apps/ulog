import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/core';
import useAttendance from '../hooks/useAttendance';
import { useRoute } from '@react-navigation/native';
import PageHeader from '../components/PageHeader';

const StudentAttendance = () => {
  const route = useRoute();
  const isFocused = useIsFocused();
  const { studentAttendance, getStudentAttendance } = useAttendance();
  const { studentId, lastName } = route.params as any;
  const flatListPadding = { paddingBottom: 100 };
  useEffect(() => {
    if (isFocused && studentId) {
      getStudentAttendance(studentId);
    }
  }, [isFocused, studentId, getStudentAttendance]);

  return (
    <View>
      <PageHeader title={`${lastName}'s Attendance`} leftButtonText="Back" />
      <View>
        {studentAttendance.length === 0 ? (
          <View className="py-3 px-3">
            <Text className="text-gray-400 italic">
              No student attendance found
            </Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={flatListPadding}
            data={studentAttendance}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity>
                  <View className="bg-white py-3 px-3 my-1 mx-2 rounded-md">
                    <Text className="text-black font-bold">
                      {item.className}
                    </Text>
                    <Text className="text-gray-500">{item.createdAt}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default StudentAttendance;
