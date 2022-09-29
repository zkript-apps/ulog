import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Button,
} from 'react-native';
import PageHeader from '../components/PageHeader';
import { useRoute, useNavigation } from '@react-navigation/native';
import useStudents, { I_Student } from '../hooks/useStudents';
import useClassStudent from '../hooks/useClassStudents';

const PickStudent = () => {
  const { getStudentByNumber } = useStudents();
  const { addNewClassStudent } = useClassStudent();
  const [studentNumber, setStudentNumber] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<I_Student>();
  const [modalOpen, setModalOpen] = useState(false);
  const navigation: any = useNavigation();
  const route = useRoute();
  const { classId, className } = route.params as any;
  const getStudent = useCallback(
    async (searchPhrase: string) => {
      const foundStudents = await getStudentByNumber(searchPhrase);
      setSelectedStudent(foundStudents.foundStudent);
    },
    [getStudentByNumber],
  );
  useEffect(() => {
    if (studentNumber) {
      getStudent(studentNumber);
    }
  }, [studentNumber, getStudent]);

  const addExistingStudent = () => {
    if (selectedStudent?.id) {
      addNewClassStudent(
        classId,
        selectedStudent?.id,
        () => {
          setModalOpen(false);
          navigation.goBack();
        },
        true,
      );
    }
  };

  return (
    <View>
      <Modal
        visible={modalOpen}
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
        transparent={true}
      >
        <View className="h-3/6 mt-auto bg-white">
          <PageHeader
            title={'Assign Student'}
            leftButtonOnPress={() => setModalOpen(false)}
          />
          <View className="mx-3 mt-2">
            <Text>
              Are you sure you want to assign {selectedStudent?.firstName}{' '}
              {selectedStudent?.lastName} ({selectedStudent?.studentNumber}) to{' '}
              {className} class?
            </Text>
            <View className="flex flex-row gap-3 mt-1">
              <View className="flex-1">
                <Button
                  onPress={addExistingStudent}
                  title="Yes, I'm sure"
                  color="#50C878"
                  accessibilityLabel="Learn more about this purple button"
                />
              </View>
              <View className="flex-1">
                <Button
                  onPress={() => setModalOpen(false)}
                  title="Cancel"
                  color="#FF5733"
                  accessibilityLabel="Learn more about this purple button"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
        {!selectedStudent ? (
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
            <TouchableOpacity onPress={() => setModalOpen(true)}>
              <View className="bg-white py-3 px-3 rounded-md">
                <Text className="text-black font-bold">
                  {selectedStudent?.firstName} {selectedStudent?.lastName}
                </Text>
                <Text className="text-gray-500">
                  {selectedStudent?.studentNumber}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default PickStudent;
