import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import PageHeader from '../components/PageHeader';
import { useRoute, useNavigation } from '@react-navigation/native';
import VectorIcon from '../components/VectorIcon';
import useClasses from '../hooks/useClasses';
import { useIsFocused } from '@react-navigation/core';
import BottomSheet from '@gorhom/bottom-sheet';

const ClassStudents = () => {
  const isFocused = useIsFocused();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { className, getClass } = useClasses();
  const navigation: any = useNavigation();
  const route = useRoute();
  const { name, id } = route.params as any;
  const flatListPadding = { paddingBottom: 100 };
  useEffect(() => {
    if (isFocused) {
      getClass(id);
    }
  }, [isFocused, getClass, id]);

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

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
                <TouchableOpacity onPress={() => console.log('click!', item)}>
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
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        enableContentPanningGesture={true}
      >
        <TouchableOpacity onPress={() => bottomSheetRef.current?.close()}>
          <View>
            <Text>Awesome 🎉</Text>
          </View>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  );
};

export default ClassStudents;
