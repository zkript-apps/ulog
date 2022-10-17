import { Keyboard, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect, useCallback } from 'react';
import uuid from 'react-native-uuid';
import { I_Student, getStudentsArr } from './useStudents';
import useClassStudent, {
  I_Class_Student,
  getClassStudentsArr,
} from './useClassStudents';

export interface I_Class {
  id: string;
  name: string;
  students?: I_Student[];
  studentCount?: number;
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

export const getClassesArr = async () => {
  const classesStr = await AsyncStorage.getItem('classes');
  const classesArr = JSON.parse(classesStr || '[]');
  return classesArr.filter((item: I_Class) => !item.isDeleted);
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

export const getClassById = async (id: string) => {
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
  const { deleteAllStudentClassById } = useClassStudent();
  const [classNameInputData, setClassNameInputData] = useState('');
  const [className, setClassName] = useState<I_Class | null>(null);
  const [classNames, setClassNames] = useState<I_Class[]>([]);
  const addNewClass = async () => {
    Keyboard.dismiss();
    try {
      if (classNameInputData === '') {
        throw 'Class name is required';
      }
      const classesArr = await getClassesArr();
      const { foundClass } = await getClassByName(classNameInputData);
      if (foundClass) {
        throw 'Class name already exist';
      }
      const toSaveClasses: I_Class[] = [
        ...classesArr,
        {
          id: uuid.v4(),
          name: classNameInputData,
          createdAt: new Date().toISOString(),
        },
      ];
      const toSaveClassesStr = JSON.stringify(toSaveClasses);
      await AsyncStorage.setItem('classes', toSaveClassesStr);
      showToast('Class added');
      setClassNameInputData('');
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
      if (classNameInputData === '') {
        throw 'Class name is required';
      }
      const classesArr = await getClassesArr();
      const { foundClass } = await getClassByName(classNameInputData);
      if (foundClass && foundClass.id === id) {
        throw 'Please change the name of the class';
      }
      if (foundClass && foundClass.id !== id) {
        throw 'Class name already exist';
      }
      const { foundClassIndex: classIndex } = await getClassById(id);
      classesArr[classIndex].name = classNameInputData;
      classesArr[classIndex].updatedAt = new Date().toISOString();
      const updatedClassesStr = JSON.stringify(classesArr);
      await AsyncStorage.setItem('classes', updatedClassesStr);
      showToast('Class updated');
      setClassNameInputData('');
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
      if (!id) {
        throw 'Class Id is required to delete';
      }
      const classesArr = await getClassesArr();
      const { foundClass } = await getClassByName(classNameInputData);
      if (foundClass?.isDeleted) {
        throw 'Class already deleted';
      }
      const { foundClassIndex: classIndex } = await getClassById(id);
      classesArr[classIndex].isDeleted = new Date().toISOString();
      const updatedClassesStr = JSON.stringify(classesArr);
      await AsyncStorage.setItem('classes', updatedClassesStr);
      deleteAllStudentClassById('classId', id);
      showToast('Class deleted');
      setClassNameInputData('');
      getClasses();
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (e) {
      showToast(e as string);
    }
  };
  const getClasses = useCallback(async () => {
    const classes = await getClassesArr();
    const students = await getStudentsArr();
    const classStudents = await getClassStudentsArr();
    const remappedClasses = classes
      .map((item: I_Class) => {
        const classStudentsFiltered = classStudents.filter(
          (classStudent: I_Class_Student) => classStudent.classId === item.id,
        );
        const studentsData = classStudentsFiltered.map(
          (classStudent: I_Class_Student) => {
            const studentsArr = students.find(
              (student: I_Student) => student.id === classStudent.studentId,
            );
            return studentsArr;
          },
        );
        return {
          ...item,
          students: studentsData,
          studentCount: studentsData.length,
        };
      })
      .reverse();
    setClassNames([...remappedClasses]);
  }, []);
  const getClass = useCallback(async (classId: string) => {
    const { foundClass } = await getClassById(classId);
    const students = await getStudentsArr();
    const classStudents = await getClassStudentsArr();
    const classStudentsFiltered = classStudents.filter(
      (classStudent: I_Class_Student) => classStudent.classId === foundClass.id,
    );
    const studentsData = classStudentsFiltered.map(
      (classStudent: I_Class_Student) => {
        const studentsArr = students.find(
          (student: I_Student) => student.id === classStudent.studentId,
        );
        return studentsArr as I_Student;
      },
    );
    setClassName({
      ...{
        ...foundClass,
        students: studentsData.reverse(),
        studentCount: studentsData.length,
      },
    });
  }, []);
  useEffect(() => {
    getClasses();
  }, [getClasses]);

  return {
    addNewClass,
    classNameInputData,
    setClassNameInputData,
    updateClass,
    deleteClass,
    classNames,
    getClasses,
    getClass,
    className,
  };
};

export default useClasses;
