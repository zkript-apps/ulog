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

const AddStudent = () => {
  const { setStudent, student, addNewStudent } = useStudents();
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
    if (params && params.studentNumber && student.studentNumber === '') {
      const studentCopy = student;
      studentCopy.studentNumber = params.studentNumber;
      setStudent({ ...studentCopy });
    }
  }, [params, setStudent, student]);
  return (
    <View>
      <PageHeader
        title="Add Student"
        rightButton={
          <VectorIcon name="checkmark-done-outline" size={30} color="#3ABFF8" />
        }
        rightButtonOnPress={() =>
          addNewStudent(
            params ? params.classId : null,
            params ? params.className : null,
          )
        }
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
              {params && params.classId && (
                <View className="flex flex-col gap-1">
                  <Text className="text-[12px]">Add to Class</Text>
                  <TextInput
                    selectionColor={'#3ABFF8'}
                    value={params.className}
                    editable={false}
                    className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800 bg-slate-200"
                  />
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default AddStudent;
