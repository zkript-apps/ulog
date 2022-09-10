import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

const Classes = () => {
  const navigation: any = useNavigation();
  return (
    <View>
      <Header />
      <View>
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          data={[
            { key: 'Devin' },
            { key: 'Dan' },
            { key: 'Dominic' },
            { key: 'Jackson' },
            { key: 'James' },
            { key: 'Joel' },
            { key: 'John' },
            { key: 'Jillian' },
            { key: 'Jimmy' },
            { key: 'Julie' },
            { key: 'Jacksons' },
            { key: 'Jamess' },
            { key: 'Joels' },
            { key: 'Johns' },
            { key: 'Jillians' },
            { key: 'Jimmys' },
            { key: 'Julies' },
          ]}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate({
                    name: 'ClassStudents',
                    params: { title: item },
                  })
                }
              >
                <View className="bg-white py-3 px-3 my-1 mx-2 rounded-md">
                  <Text className="text-black font-bold">{item.key}</Text>
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
