import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type Props = {
  title: string;
  rightButtonText?: string;
  rightButton?: React.ReactNode;
  rightButtonOnPress?: Function;
};

const Header = ({ title, rightButtonOnPress, rightButton }: Props) => {
  const navigation: any = useNavigation();
  return (
    <View className="flex flex-row px-3 py-2">
      <Text className="flex-1 font-bold text-black text-xl">{title}</Text>
      <TouchableOpacity
        className="flex-none"
        onPress={() =>
          rightButtonOnPress ? rightButtonOnPress() : navigation.goBack()
        }
      >
        {rightButton}
      </TouchableOpacity>
    </View>
  );
};

export default Header;
