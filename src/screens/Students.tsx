import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import useStudents from '../hooks/useStudents';
import VectorIcon from '../components/VectorIcon';
import { useIsFocused } from '@react-navigation/core';

const Students = () => {
  const isFocused = useIsFocused();
  const { students, getStudents, deleteStudent } = useStudents();
  const navigation: any = useNavigation();
  const flatListPadding = { paddingBottom: 100 };
  useEffect(() => {
    if (isFocused) {
      getStudents();
    }
  }, [isFocused, getStudents]);

  const onLongPressHandler = (fullName: string, studentId: string) => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${fullName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => deleteStudent(studentId) },
      ],
    );
  };

  return (
    <View>
      <Header
        title="Students"
        rightButton={
          <VectorIcon name="add-circle-outline" size={30} color="#3ABFF8" />
        }
        rightButtonOnPress={() => navigation.navigate({ name: 'AddStudent' })}
      />
      <View>
        {students.length === 0 ? (
          <View className="px-3">
            <Text className="text-gray-400 italic">No students found</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={flatListPadding}
            data={students}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onLongPress={() =>
                    onLongPressHandler(
                      `${item.firstName} ${item.lastName}`,
                      item.id,
                    )
                  }
                >
                  <View className="bg-white py-3 px-3 my-1 mx-2 rounded-md">
                    <Text className="text-black font-bold">
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text className="text-gray-500">{item.studentNumber}</Text>
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

export default Students;
