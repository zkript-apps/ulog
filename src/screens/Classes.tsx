import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import useClasses from '../hooks/useClasses';

const Classes = () => {
  const { classNames } = useClasses();
  const navigation: any = useNavigation();
  const flatListPadding = { paddingBottom: 100 };

  return (
    <View>
      <Header />
      <View>
        <FlatList
          contentContainerStyle={flatListPadding}
          data={classNames}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate({
                    name: 'ClassStudents',
                    params: { item },
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
      </View>
    </View>
  );
};

export default Classes;
