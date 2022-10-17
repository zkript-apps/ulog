import React, { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { View, TextInput, Text } from 'react-native';
import VectorIcon from '../components/VectorIcon';
import useClasses from '../hooks/useClasses';
import { useRoute } from '@react-navigation/native';

const EditClass = () => {
  const route = useRoute();
  const { updateClass, classNameInputData, setClassNameInputData } =
    useClasses();
  const { classId, className } = route.params as any;
  useEffect(() => {
    setClassNameInputData(className);
  }, [className, setClassNameInputData]);
  return (
    <View>
      <PageHeader
        title="Update Class"
        rightButton={
          <VectorIcon name="checkmark-done-outline" size={30} color="#3ABFF8" />
        }
        rightButtonOnPress={() => updateClass(classId)}
      />
      <View className="mx-3 mt-5">
        <View className="flex flex-col gap-1">
          <Text className="text-[12px]">Class Name</Text>
          <TextInput
            onChangeText={setClassNameInputData}
            selectionColor={'#3ABFF8'}
            value={classNameInputData}
            className="border-2 border-gray-400 rounded-md h-10 px-2 focus:border-gray-800"
            defaultValue={className}
          />
        </View>
      </View>
    </View>
  );
};

export default EditClass;
