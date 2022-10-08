import React, {
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import useStudents, { I_Student } from '../hooks/useStudents';
import VectorIcon from '../components/VectorIcon';
import { useIsFocused } from '@react-navigation/core';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

const Students = () => {
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { students, getStudents, deleteStudent } = useStudents();
  const [selectedStudent, setSelectedStudent] = useState<I_Student>();
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
        {
          text: 'Yes',
          onPress: () => {
            handleClose();
            deleteStudent(studentId);
          },
        },
      ],
    );
  };

  const snapPoints = useMemo(() => ['1%', '20%'], []);

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        opacity={0.2}
      />
    ),
    [],
  );

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
                  onPress={() => {
                    navigation.navigate({
                      name: 'StudentProfile',
                      params: {
                        ...item,
                      },
                    });
                  }}
                  onLongPress={() => {
                    handleSheetChanges(1);
                    setSelectedStudent(item);
                  }}
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
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={-1}
          onChange={handleSheetChanges}
          // eslint-disable-next-line react-native/no-inline-styles
          handleStyle={{ display: 'none' }}
          // eslint-disable-next-line react-native/no-inline-styles
          backgroundStyle={{ borderRadius: 8 }}
          backdropComponent={renderBackdrop}
        >
          <View className="flex flex-row p-3 border-b-[1px] border-gray-100">
            <Text className="flex-1 text-black">Actions</Text>
            <TouchableOpacity onPress={() => handleClose()}>
              <VectorIcon name="close" size={20} color="#cccccc" />
            </TouchableOpacity>
          </View>
          <View className="flex flex-row p-2 gap-2">
            <Pressable
              className="flex flex-col gap-2"
              onPress={() => {
                handleClose();
                navigation.navigate({
                  name: 'EditStudent',
                  params: {
                    ...selectedStudent,
                  },
                });
              }}
            >
              <View className="h-9 w-9 bg-blue-600 rounded-full flex justify-center">
                <View className="ml-2">
                  <VectorIcon name="pencil" size={20} color="#ffffff" />
                </View>
              </View>
              <Text className="text-xs text-center">Edit</Text>
            </Pressable>
            <Pressable
              className="flex flex-col gap-2"
              onPress={() =>
                selectedStudent &&
                onLongPressHandler(
                  `${selectedStudent.firstName} ${selectedStudent.lastName}`,
                  selectedStudent?.id,
                )
              }
            >
              <View className="h-9 w-9 bg-red-600 rounded-full flex justify-center">
                <View className="ml-2">
                  <VectorIcon name="trash" size={20} color="#ffffff" />
                </View>
              </View>
              <Text className="text-xs text-center">Delete</Text>
            </Pressable>
          </View>
        </BottomSheet>
      </Portal>
    </View>
  );
};

export default Students;
