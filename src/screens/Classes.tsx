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
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import useClasses, { I_Class } from '../hooks/useClasses';
import VectorIcon from '../components/VectorIcon';
import { useIsFocused } from '@react-navigation/core';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

const Classes = () => {
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { classNames, getClasses, deleteClass } = useClasses();
  const [selectedClass, setSelectedClass] = useState<I_Class>();
  const navigation: any = useNavigation();
  const flatListPadding = { paddingBottom: 100 };
  useEffect(() => {
    if (isFocused) {
      getClasses();
    }
  }, [isFocused, getClasses]);

  const onLongPressHandler = (className: string, classId: string) => {
    Alert.alert(
      'Delete Class',
      `Are you sure you want to delete ${className} class?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            handleClose();
            deleteClass(classId);
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
        title="Classes"
        rightButton={
          <VectorIcon name="add-circle-outline" size={30} color="#3ABFF8" />
        }
        rightButtonOnPress={() => navigation.navigate({ name: 'AddClass' })}
      />
      <View>
        {classNames.length === 0 ? (
          <View className="py-3 px-3">
            <Text className="text-gray-400 italic">No classes found</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={flatListPadding}
            data={classNames}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate({
                      name: 'ClassStudents',
                      params: { ...item },
                    })
                  }
                  onLongPress={() => {
                    handleSheetChanges(1);
                    setSelectedClass(item);
                  }}
                >
                  <View className="bg-white py-3 px-3 my-1 mx-2 rounded-md">
                    <Text className="text-black font-bold">{item.name}</Text>
                    <Text className="text-gray-500">
                      {item.studentCount} student
                      {item.studentCount && item.studentCount > 1 ? 's' : ''}
                    </Text>
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
              onPress={() => {
                handleClose();
                navigation.navigate({
                  name: 'ScanClass',
                  params: {
                    classId: selectedClass?.id,
                    className: selectedClass?.name,
                  },
                });
              }}
            >
              <View className="h-9 w-9 bg-green-600 rounded-full flex justify-center">
                <View className="ml-2">
                  <VectorIcon name="qr-code" size={20} color="#ffffff" />
                </View>
              </View>
              <Text className="text-xs text-center">Scan</Text>
            </Pressable>
            <Pressable
              className="flex flex-col gap-2 items-center"
              onPress={() => {
                handleClose();
                navigation.navigate({
                  name: 'EditClass',
                  params: {
                    classId: selectedClass?.id,
                    className: selectedClass?.name,
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
              className="flex flex-col gap-2 items-center"
              onPress={() =>
                selectedClass &&
                onLongPressHandler(selectedClass?.name, selectedClass?.id)
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

export default Classes;
