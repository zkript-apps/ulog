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
  Pressable,
  Alert,
} from 'react-native';
import PageHeader from '../components/PageHeader';
import { useRoute, useNavigation } from '@react-navigation/native';
import VectorIcon from '../components/VectorIcon';
import useClasses from '../hooks/useClasses';
import userClassStudents from '../hooks/useClassStudents';
import { useIsFocused } from '@react-navigation/core';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { I_Student } from '../hooks/useStudents';

const ClassStudents = () => {
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { className, getClass } = useClasses();
  const { deleteClassStudentByClassIdStudentId } = userClassStudents();
  const [selectedClassStudent, setSelectedClassStudent] = useState<I_Student>();
  const navigation: any = useNavigation();
  const route = useRoute();
  const { name, id } = route.params as any;
  const flatListPadding = { paddingBottom: 100 };
  useEffect(() => {
    if (isFocused) {
      getClass(id);
    }
  }, [isFocused, getClass, id]);

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

  const onLongPressHandler = (
    fullName: string,
    classId: string,
    studentId: string,
  ) => {
    Alert.alert(
      'Remove Student',
      `Are you sure you want to remove ${fullName} from class ${name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            handleClose();
            deleteClassStudentByClassIdStudentId(classId, studentId);
            getClass(id);
          },
        },
      ],
    );
  };

  return (
    <View>
      <PageHeader
        title={`${name} Students`}
        rightButton={
          <VectorIcon name="person-add-outline" size={20} color="#3ABFF8" />
        }
        rightButtonOnPress={() =>
          navigation.navigate({
            name: 'PickStudent',
            params: { classId: id, className: name },
          })
        }
        leftButtonText="Back"
      />
      <View>
        {className?.students?.length === 0 ? (
          <View className="py-3 px-3">
            <Text className="text-gray-400 italic">No student found</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={flatListPadding}
            data={className?.students}
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
                    setSelectedClassStudent(item);
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
          <View className="flex flex-row p-2 gap-6">
            <Pressable
              className="flex flex-col gap-2 items-center"
              onPress={() =>
                selectedClassStudent &&
                onLongPressHandler(
                  `${selectedClassStudent.firstName} ${selectedClassStudent.lastName}`,
                  id,
                  selectedClassStudent?.id,
                )
              }
            >
              <View className="h-9 w-9 bg-red-600 rounded-full flex justify-center">
                <View className="ml-2">
                  <VectorIcon name="trash" size={20} color="#ffffff" />
                </View>
              </View>
              <Text className="text-xs text-center">Remove</Text>
            </Pressable>
          </View>
        </BottomSheet>
      </Portal>
    </View>
  );
};

export default ClassStudents;
