import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import PageHeader from '../components/PageHeader';
import { useRoute, useNavigation } from '@react-navigation/native';
import useStudents, { I_Student } from '../hooks/useStudents';

const PickStudent = () => {
  const { getStudentByNumber } = useStudents();
  const [students, setStudents] = useState<I_Student>();
  const [studentNumber, setStudentNumber] = useState('');
  const navigation: any = useNavigation();
  const route = useRoute();
  const { classId, className } = route.params as any;
  const getStudent = useCallback(
    async (searchPhrase: string) => {
      const foundStudents = await getStudentByNumber(searchPhrase);
      setStudents(foundStudents.foundStudent);
    },
    [getStudentByNumber],
  );
  useEffect(() => {
    if (studentNumber) {
      getStudent(studentNumber);
    }
  }, [studentNumber, getStudent]);

  return (
    <View>
      <PageHeader title={'Pick Student'} leftButtonText="Back" />
      <View className="mx-2 mt-5 mb-2">
        <TextInput
          onChangeText={setStudentNumber}
          selectionColor={'#3ABFF8'}
          value={studentNumber}
          placeholder="Student Number"
          autoFocus={true}
          className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
        />
        <Text className="mt-2 text-[11px] italic text-gray-400">
          If the student number you put above doesn't exist in your database,
          you can create one for it in this page.
        </Text>
      </View>
      <View>
        {!students ? (
          <View className="mx-2">
            <View className="h-[1px] bg-gray-200" />
            {studentNumber !== '' && (
              <View>
                <Text className="text-gray-400 italic my-2">
                  Oh no! No result found. Click the card below to create a
                  student for the student number you put in above and it will be
                  automatically assigned to "{className}" class.
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate({
                      name: 'AddStudent',
                      params: { classId, className, studentNumber },
                    })
                  }
                >
                  <View className="bg-white py-3 px-3 my-2 rounded-md">
                    <Text className="text-black font-bold">...</Text>
                    <Text className="text-gray-500">{studentNumber}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View className="mx-2">
            <View className="h-[1px] bg-gray-200" />
            <Text className="text-gray-400 italic my-2">
              Yey! result found. Click the card below to assign it to{' '}
              {className} class.
            </Text>
            <TouchableOpacity onPress={() => console.log('click!')}>
              <View className="bg-white py-3 px-3 rounded-md">
                <Text className="text-black font-bold">
                  {students?.firstName} {students?.lastName}
                </Text>
                <Text className="text-gray-500">{students?.studentNumber}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default PickStudent;
