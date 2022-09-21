import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import useClasses from '../hooks/useClasses';
import VectorIcon from '../components/VectorIcon';
import { useIsFocused } from '@react-navigation/core';

const Classes = () => {
  const isFocused = useIsFocused();
  const { classNames, getClasses } = useClasses();
  const navigation: any = useNavigation();
  const flatListPadding = { paddingBottom: 100 };
  useEffect(() => {
    if (isFocused) {
      getClasses();
    }
  }, [isFocused, getClasses]);
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
                >
                  <View className="bg-white py-3 px-3 my-1 mx-2 rounded-md">
                    <Text className="text-black font-bold">{item.name}</Text>
                    <Text className="text-gray-500">0 students</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default Classes;
