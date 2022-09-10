import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type T_Props = {
  name: string;
  size?: number;
  color?: string;
};

const VectorIcon = ({ name, size = 20, color = '#ffffff' }: T_Props) => {
  return (
    <View>
      <Text>
        <Icon name={name} size={size} color={color} />
      </Text>
    </View>
  );
};

export default VectorIcon;
