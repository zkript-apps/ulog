import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

type Props = {
  leftButtonText?: string;
  title?: string;
  rightButtonText?: string;
  rightButton?: React.ReactNode;
  rightButtonOnPress?: Function;
};

const PageHeader = ({
  leftButtonText = 'Cancel',
  title,
  rightButton,
  rightButtonOnPress,
}: Props) => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View className="flex flex-row px-3 py-2 items-center">
      <TouchableOpacity
        className="flex-none w-20"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-[#3ABFF8] text-md">{leftButtonText}</Text>
      </TouchableOpacity>
      <Text className="flex-1 font-bold text-black text-lg text-center">
        {title ? title : route.name}
      </Text>
      <TouchableOpacity
        className="flex-none items-end w-20"
        onPress={() =>
          rightButtonOnPress ? rightButtonOnPress() : navigation.goBack()
        }
      >
        {rightButton}
      </TouchableOpacity>
    </View>
  );
};

export default PageHeader;
