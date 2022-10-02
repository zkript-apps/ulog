import React, { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import {
  View,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import VectorIcon from '../components/VectorIcon';
import useStudents from '../hooks/useStudents';
import { useRoute } from '@react-navigation/native';

const EditStudent = () => {
  const { setStudent, student, updateStudent } = useStudents();
  const route = useRoute();
  const params = route.params as any;
  const handleChangeText = (
    value: string,
    name: 'firstName' | 'lastName' | 'guardianPhoneNumber' | 'studentNumber',
  ) => {
    const studentCopy = student;
    studentCopy[name] = value;
    setStudent({ ...studentCopy });
  };
  useEffect(() => {
    if (
      params &&
      params.firstName &&
      student.firstName === '' &&
      params.lastName &&
      student.lastName === '' &&
      params.studentNumber &&
      student.studentNumber === '' &&
      params.guardianPhoneNumber &&
      student.guardianPhoneNumber === ''
    ) {
      const studentCopy = student;
      studentCopy.firstName = params.firstName;
      studentCopy.lastName = params.lastName;
      studentCopy.studentNumber = params.studentNumber;
      studentCopy.guardianPhoneNumber = params.guardianPhoneNumber;
      setStudent({ ...studentCopy });
    }
  }, [params, setStudent, student]);
  return (
    <View>
      <PageHeader
        title="Update Student"
        rightButton={
          <VectorIcon name="checkmark-done-outline" size={30} color="#3ABFF8" />
        }
        rightButtonOnPress={() => updateStudent(params ? params.id : null)}
      />
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="mb-10"
        >
          <View className="mr-3 ml-2 mt-5">
            <View className="flex flex-col gap-1">
              <View className="flex flex-col gap-1">
                <Text className="text-[12px]">First Name</Text>
                <TextInput
                  onChangeText={(e: string) => handleChangeText(e, 'firstName')}
                  selectionColor={'#3ABFF8'}
                  value={student?.firstName}
                  className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
                />
              </View>
              <View className="flex flex-col gap-1">
                <Text className="text-[12px]">Last Name</Text>
                <TextInput
                  onChangeText={(e: string) => handleChangeText(e, 'lastName')}
                  selectionColor={'#3ABFF8'}
                  value={student?.lastName}
                  className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
                />
              </View>
              <View className="flex flex-col gap-1">
                <Text className="text-[12px]">Student Number</Text>
                <TextInput
                  onChangeText={(e: string) =>
                    handleChangeText(e, 'studentNumber')
                  }
                  selectionColor={'#3ABFF8'}
                  value={student?.studentNumber}
                  className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
                />
              </View>
              <View className="flex flex-col gap-1">
                <Text className="text-[12px]">Guardian Phone Number</Text>
                <TextInput
                  onChangeText={(e: string) =>
                    handleChangeText(e, 'guardianPhoneNumber')
                  }
                  selectionColor={'#3ABFF8'}
                  value={student?.guardianPhoneNumber}
                  className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default EditStudent;
