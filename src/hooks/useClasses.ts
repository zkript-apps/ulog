import { Keyboard, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import uuid from 'react-native-uuid';

export interface I_Class {
  id: string;
  name: string;
  updatedAt?: string;
  createdAt: string;
  isDeleted?: string;
}

export interface I_Get_Class_Result {
  foundClass: I_Class;
  foundClassIndex: number;
}

const showToast = (value: string) => {
  ToastAndroid.showWithGravity(value, ToastAndroid.LONG, ToastAndroid.BOTTOM);
};

const getClassesArr = async () => {
  const classesStr = await AsyncStorage.getItem('classes');
  const classesArr = JSON.parse(classesStr || '[]');
  return classesArr;
};

const getClassByName = async (className: string) => {
  const classesArr = await getClassesArr();
  const foundClass = classesArr.find(
    (item: I_Class) =>
      item.name.toLocaleLowerCase() === className.toLocaleLowerCase(),
  );
  const foundClassIndex = classesArr.findIndex(
    (item: I_Class) =>
      item.name.toLocaleLowerCase() === className.toLocaleLowerCase(),
  );
  return {
    foundClass: foundClass,
    foundClassIndex: foundClassIndex,
  } as I_Get_Class_Result;
};

const getClassById = async (id: string) => {
  const classesArr = await getClassesArr();
  const foundClass = classesArr.find((item: I_Class) => item.id === id);
  const foundClassIndex: number = classesArr.findIndex(
    (item: I_Class) => item.id === id,
  );
  return {
    foundClass: foundClass,
    foundClassIndex: foundClassIndex,
  } as I_Get_Class_Result;
};

const useClasses = () => {
  const navigation = useNavigation();
  const [className, setClassName] = useState('');
  const [classNames, setClassNames] = useState<I_Class[]>([]);
  const addNewClass = async () => {
    Keyboard.dismiss();
    try {
      if (className === '') {
        throw 'Class name is required';
      }
      const classesArr = await getClassesArr();
      const { foundClass } = await getClassByName(className);
      if (foundClass) {
        throw 'Class name already exist';
      }
      const toSaveClasses: I_Class[] = [
        ...classesArr,
        { id: uuid.v4(), name: className, createdAt: new Date().toISOString() },
      ];
      const toSaveClassesStr = JSON.stringify(toSaveClasses);
      await AsyncStorage.setItem('classes', toSaveClassesStr);
      showToast('Class added');
      setClassName('');
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (e) {
      showToast(e as string);
    }
  };
  const updateClass = async (id: string) => {
    Keyboard.dismiss();
    try {
      if (className === '') {
        throw 'Class name is required';
      }
      const classesArr = await getClassesArr();
      const { foundClass } = await getClassByName(className);
      if (foundClass && foundClass.id === id) {
        throw 'Please change the name of the class';
      }
      if (foundClass && foundClass.id !== id) {
        throw 'Class name already exist';
      }
      const { foundClassIndex: classIndex } = await getClassById(id);
      classesArr[classIndex].name = className;
      classesArr[classIndex].updatedAt = new Date().toISOString();
      const updatedClassesStr = JSON.stringify(classesArr);
      await AsyncStorage.setItem('classes', updatedClassesStr);
      showToast('Class updated');
      setClassName('');
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (e) {
      showToast(e as string);
    }
  };
  const deleteClass = async (id: string) => {
    Keyboard.dismiss();
    try {
      if (id) {
        throw 'Class Id is required to delete';
      }
      const classesArr = await getClassesArr();
      const { foundClass } = await getClassByName(className);
      if (foundClass?.isDeleted) {
        throw 'Class already deleted';
      }
      const { foundClassIndex: classIndex } = await getClassById(id);
      classesArr[classIndex].isDeleted = new Date().toISOString();
      const updatedClassesStr = JSON.stringify(classesArr);
      await AsyncStorage.setItem('classes', updatedClassesStr);
      showToast('Class updated');
      setClassName('');
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (e) {
      showToast(e as string);
    }
  };
  const getClasses = async () => {
    const classes = await getClassesArr();
    setClassNames(classes.reverse());
  };
  useEffect(() => {
    getClasses();
  }, []);

  return {
    addNewClass,
    className,
    setClassName,
    updateClass,
    deleteClass,
    classNames,
    getClasses,
  };
};

export default useClasses;
