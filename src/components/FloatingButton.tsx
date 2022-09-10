import React from 'react';
import { View, StyleSheet, TouchableHighlight } from 'react-native';
import VectorIcon from '../components/VectorIcon';

const FloatingButton = () => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      onPress={() => console.log('yessir1')}
    >
      <View
        className="bg-[#3ABFF8] w-12 h-12 rounded-full absolute shadow-sm right-7 bottom-28"
        style={style.shadow}
      >
        <View className="absolute top-[17%] left-[20%]">
          <VectorIcon name="ios-add" size={30} />
        </View>
      </View>
    </TouchableHighlight>
  );
};

const style = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FloatingButton;
