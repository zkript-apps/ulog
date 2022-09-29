import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import useClasses from '../hooks/useClasses';
import VectorIcon from '../components/VectorIcon';
import { useIsFocused } from '@react-navigation/core';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Classes = () => {
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const { classNames, getClasses } = useClasses();
  const navigation: any = useNavigation();
  const flatListPadding = { paddingBottom: 100 };
  useEffect(() => {
    if (isFocused) {
      getClasses();
    }
  }, [isFocused, getClasses]);

  // const onLongPressHandler = (className: string, classId: string) => {
  //   Alert.alert(
  //     'Delete Class',
  //     `Are you sure you want to delete ${className} class?`,
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       { text: 'Yes', onPress: () => deleteClass(classId) },
  //     ],
  //   );
  // };

  const snapPoints = useMemo(() => ['25%', '90%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  return (
    <View className="h-full">
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
                    handlePresentModalPress();
                    // handleSheetChanges(2);
                    // onLongPressHandler(item.name, item.id);
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
      <GestureHandlerRootView>
        <BottomSheetModal
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          enableContentPanningGesture={true}
          enableHandlePanningGesture={true}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          // eslint-disable-next-line react-native/no-inline-styles
          handleStyle={{ display: 'none' }}
          // eslint-disable-next-line react-native/no-inline-styles
          backgroundStyle={{ borderRadius: 0 }}
        >
          <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
            <View>
              <Text>Awesome 🎉</Text>
            </View>
          </TouchableOpacity>
        </BottomSheetModal>
      </GestureHandlerRootView>
    </View>
  );
};

export default Classes;
