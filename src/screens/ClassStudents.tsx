import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import PageHeader from '../components/PageHeader';
import { useRoute, useNavigation } from '@react-navigation/native';
import VectorIcon from '../components/VectorIcon';

const ClassStudents = () => {
  const navigation: any = useNavigation();
  const route = useRoute();
  const { title } = route.params as any;
  const flatListPadding = { paddingBottom: 100 };
  return (
    <View>
      <PageHeader
        title={`${title.key} Students`}
        rightButton={
          <VectorIcon name="person-add-outline" size={20} color="#3ABFF8" />
        }
        rightButtonOnPress={() =>
          navigation.navigate({
            name: 'AddClassStudent',
            params: { classId: title },
          })
        }
        leftButtonText="Back"
      />
      <View>
        <FlatList
          contentContainerStyle={flatListPadding}
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
              <TouchableOpacity onPress={() => console.log('click!', item)}>
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

export default ClassStudents;
