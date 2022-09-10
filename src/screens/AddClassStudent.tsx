import React, { useState } from 'react';
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

const AddClassStudent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [guardianPhoneNumber, setGuardianPhoneNumber] = useState('');
  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="mb-10"
      >
        <PageHeader
          title="Add Class Student"
          rightButton={
            <VectorIcon
              name="checkmark-done-outline"
              size={30}
              color="#3ABFF8"
            />
          }
        />
        <View className="mr-3 ml-2 mt-5">
          <View className="flex flex-col gap-1">
            <View className="flex flex-col gap-1">
              <Text className="text-[12px]">Class Name</Text>
              <TextInput
                selectionColor={'#3ABFF8'}
                value={'Devin'}
                editable={false}
                className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800 bg-slate-200"
              />
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-[12px]">First Name</Text>
              <TextInput
                onChangeText={setFirstName}
                selectionColor={'#3ABFF8'}
                value={firstName}
                className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
              />
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-[12px]">Last Name</Text>
              <TextInput
                onChangeText={setLastName}
                selectionColor={'#3ABFF8'}
                value={lastName}
                className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
              />
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-[12px]">Student Number</Text>
              <TextInput
                onChangeText={setStudentNumber}
                selectionColor={'#3ABFF8'}
                value={studentNumber}
                className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
              />
            </View>
            <View className="flex flex-col gap-1">
              <Text className="text-[12px]">Guardian Phone Number</Text>
              <TextInput
                onChangeText={setGuardianPhoneNumber}
                selectionColor={'#3ABFF8'}
                value={guardianPhoneNumber}
                className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default AddClassStudent;
