import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import VectorIcon from '../components/VectorIcon';
import { useNavigation } from '@react-navigation/native';

const Header = () => {
  const navigation: any = useNavigation();
  return (
    <View className="flex flex-row px-3 py-2">
      <Text className="flex-1 font-bold text-black text-xl">Classes</Text>
      <TouchableOpacity
        className="flex-none"
        onPress={() => navigation.navigate({ name: 'AddClass' })}
      >
        <VectorIcon name="add-circle-outline" size={30} color="#3ABFF8" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
