import { Keyboard, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useState, useEffect, useCallback } from 'react';

export interface I_Class_Student {
  id?: string;
  studentId: string;
  classId: string;
  updatedAt?: string;
  createdAt?: string;
  isDeleted?: string;
}

export interface I_Get_Class_Student_Result {
  foundClassStudent: I_Class_Student;
  foundClassStudentIndex: number;
}

const showToast = (value: string) => {
  ToastAndroid.showWithGravity(value, ToastAndroid.LONG, ToastAndroid.BOTTOM);
};

export const getClassStudentsArr = async () => {
  const classStudentsStr = await AsyncStorage.getItem('classStudents');
  const classStudentsArr = JSON.parse(classStudentsStr || '[]');
  return classStudentsArr.filter((item: I_Class_Student) => !item.isDeleted);
};

const useClassStudent = () => {
  const [classStudents, setClassStudents] = useState<I_Class_Student[]>([]);
  const getClassStudentByClassId = async (classId: string) => {
    const classStudentsArr = await getClassStudentsArr();
    const foundClassStudent = classStudentsArr.find(
      (item: I_Class_Student) => item.classId === classId,
    );
    const foundClassStudentIndex = classStudentsArr.findIndex(
      (item: I_Class_Student) => item.classId === classId,
    );
    return {
      foundClassStudent: foundClassStudent,
      foundClassStudentIndex: foundClassStudentIndex,
    } as I_Get_Class_Student_Result;
  };
  const getClassStudentById = async (id: string) => {
    const classStudentsArr = await getClassStudentsArr();
    const foundClassStudent = classStudentsArr.find(
      (item: I_Class_Student) => item.id === id,
    );
    const foundClassStudentIndex = classStudentsArr.findIndex(
      (item: I_Class_Student) => item.id === id,
    );
    return {
      foundClassStudent: foundClassStudent,
      foundClassStudentIndex: foundClassStudentIndex,
    } as I_Get_Class_Student_Result;
  };
  const addNewClassStudent = async (
    classId: string,
    studentId: string,
    successCallback?: Function,
    showSuccessToast?: boolean,
  ) => {
    Keyboard.dismiss();
    try {
      if (classId === '' || studentId === '') {
        throw 'Required fields are empty';
      }
      const classesArr = await getClassStudentsArr();
      const { foundClassStudent } = await getClassStudentByClassId(classId);
      if (foundClassStudent && foundClassStudent.studentId === studentId) {
        throw 'Student already assigned to this class';
      }
      const toSaveClasses: I_Class_Student[] = [
        ...classesArr,
        {
          classId,
          studentId,
          createdAt: new Date().toISOString(),
          id: uuid.v4(),
        },
      ];
      const toSaveClassesStr = JSON.stringify(toSaveClasses);
      await AsyncStorage.setItem('classStudents', toSaveClassesStr);
      if (successCallback) {
        successCallback();
      }
      if (showSuccessToast) {
        showToast('Student added to class');
      }
    } catch (e) {
      showToast(e as string);
    }
  };
  const deleteClassStudent = async (id: string) => {
    Keyboard.dismiss();
    try {
      if (!id) {
        throw 'Class student Id is required to delete';
      }
      const classStudentsArr = await getClassStudentsArr();
      const { foundClassStudent, foundClassStudentIndex } =
        await getClassStudentById(id);
      if (foundClassStudent?.isDeleted) {
        throw 'Class student already deleted';
      }
      classStudentsArr[foundClassStudentIndex].isDeleted =
        new Date().toISOString();
      const updatedClassesStr = JSON.stringify(classStudentsArr);
      await AsyncStorage.setItem('classStudents', updatedClassesStr);
    } catch (e) {
      showToast(e as string);
    }
  };

  const deleteAllStudentClassById = async (
    type: 'studentId' | 'classId',
    id: string,
  ) => {
    Keyboard.dismiss();
    try {
      if (!id) {
        throw 'Class student Id is required to delete';
      }
      const classStudentsArr = await getClassStudentsArr();
      const classStudentArrWithoutStudent = classStudentsArr.map(
        (item: I_Class_Student) => {
          return id === item[type]
            ? {
                ...item,
                isDeleted: new Date().toISOString(),
              }
            : item;
        },
      );
      const updatedClassesStr = JSON.stringify(classStudentArrWithoutStudent);
      await AsyncStorage.setItem('classStudents', updatedClassesStr);
    } catch (e) {
      showToast(e as string);
    }
  };

  const getClassStudents = useCallback(
    async (classId?: string, studentId?: string) => {
      const classStudentsArr = await getClassStudentsArr();
      if (classId && !studentId) {
        const foundClassStudents = classStudentsArr.filter(
          (item: I_Class_Student) => item.classId === classId,
        );
        setClassStudents([...foundClassStudents]);
      } else if (!classId && studentId) {
        const foundClassStudents = classStudentsArr.filter(
          (item: I_Class_Student) => item.studentId === studentId,
        );
        setClassStudents([...foundClassStudents]);
      } else if (classId && studentId) {
        const foundClassStudents = classStudentsArr.find(
          (item: I_Class_Student) =>
            item.studentId === studentId && item.classId === classId,
        );
        setClassStudents([...foundClassStudents]);
      } else if (!classId && !studentId) {
        setClassStudents([...classStudentsArr]);
      }
    },
    [],
  );

  useEffect(() => {
    getClassStudents();
  }, [getClassStudents]);

  return {
    classStudents,
    getClassStudents,
    addNewClassStudent,
    deleteClassStudent,
    deleteAllStudentClassById,
  };
};

export default useClassStudent;
