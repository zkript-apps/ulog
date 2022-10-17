import React from 'react';
import { View, Text, Linking, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import VectorIcon from '../components/VectorIcon';

const About = () => {
  const openWEB = (url: string) => {
    Linking.openURL(url);
  };
  return (
    <View>
      <Header title="About" />
      <View>
        <Text className="my-1 mx-3">
          This app is created to help teachers and parents/guardians to manage
          the attendance of the students.
        </Text>
        <Text className="my-1 mx-3">
          This app was created and maintained by{' '}
          <Text
            className="text-blue-500 underline font-medium"
            onPress={() => openWEB('https://jpmadrigal.com')}
          >
            John Patrick M. Madrigal
          </Text>{' '}
          with the help of his colleagues at{' '}
          <Text
            className="text-blue-500 underline font-medium"
            onPress={() => openWEB('https://zkript.dev')}
          >
            Zkript
          </Text>
          , a software development company.
        </Text>

        <Text className="my-1 mx-3">
          If you have any concerns, problems or suggestions about this app,
          please email us at{' '}
          <Text
            className="text-blue-500 underline font-medium"
            onPress={() => openWEB('mailto:help@zkript.dev')}
          >
            help@zkript.dev
          </Text>
          .
        </Text>
        <Text className="my-1 mx-3">
          If you want to build your own software, whether if it is a website, a
          web application, a mobile application or a desktop application, please
          email us at{' '}
          <Text
            className="text-blue-500 underline font-medium"
            onPress={() => openWEB('mailto:inquire@zkript.dev')}
          >
            inquire@zkript.dev
          </Text>
          .
        </Text>

        <View className="my-1 mx-3">
          <TouchableOpacity
            className="flex flex-row items-center mt-2"
            onPress={() => openWEB('https://zkript.dev')}
          >
            <VectorIcon name="md-globe" size={30} color="#3b82f6" />
            <Text className="text-blue-500 underline font-medium ml-1">
              zkript.dev
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-row items-center mt-2"
            onPress={() => openWEB('https://facebook.com/zkriptofficial')}
          >
            <VectorIcon name="logo-facebook" size={30} color="#1773EA" />
            <Text className="text-blue-500 underline font-medium ml-1">
              /zkriptofficial
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-row items-center mt-2"
            onPress={() => openWEB('https://linkedin.com/company/zkript')}
          >
            <VectorIcon name="logo-linkedin" size={30} color="#0073B1" />
            <Text className="text-blue-500 underline font-medium ml-1">
              /company/zkript
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default About;
