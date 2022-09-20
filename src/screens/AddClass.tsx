import React from 'react';
import PageHeader from '../components/PageHeader';
import { View, TextInput, Text } from 'react-native';
import VectorIcon from '../components/VectorIcon';
import useClasses from '../hooks/useClasses';

const AddClass = () => {
  const { addNewClass, className, setClassName } = useClasses();
  return (
    <View>
      <PageHeader
        title="Add Class"
        rightButton={
          <VectorIcon name="checkmark-done-outline" size={30} color="#3ABFF8" />
        }
        rightButtonOnPress={addNewClass}
      />
      <View className="mx-3 mt-5">
        <View className="flex flex-col gap-1">
          <Text className="text-[12px]">Class Name</Text>
          <TextInput
            onChangeText={setClassName}
            selectionColor={'#3ABFF8'}
            value={className}
            className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
          />
        </View>
      </View>
    </View>
  );
};

export default AddClass;
