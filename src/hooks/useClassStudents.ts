import { Keyboard, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

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

const getClassStudentsArr = async () => {
  const classStudentsStr = await AsyncStorage.getItem('classStudents');
  const classStudentsArr = JSON.parse(classStudentsStr || '[]');
  return classStudentsArr;
};

const getClassStudentByStudentId = async (studentId: string) => {
  const classStudentsArr = await getClassStudentsArr();
  const foundClassStudent = classStudentsArr.find(
    (item: I_Class_Student) => item.studentId === studentId,
  );
  const foundClassStudentIndex = classStudentsArr.findIndex(
    (item: I_Class_Student) => item.studentId === studentId,
  );
  return {
    foundClassStudent: foundClassStudent,
    foundClassStudentIndex: foundClassStudentIndex,
  } as I_Get_Class_Student_Result;
};

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

const useClassStudent = () => {
  const addNewClassStudent = async (classId: string, studentId: string) => {
    Keyboard.dismiss();
    try {
      if (classId === '' || studentId === '') {
        throw 'Required fields are empty';
      }
      const classesArr = await getClassStudentsArr();
      const { foundClassStudent } = await getClassStudentByClassId(classId);
      if (foundClassStudent && foundClassStudent.studentId === studentId) {
        throw 'Class student already exist';
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
      console.log('Class student add: ', {
        classId,
        studentId,
        createdAt: new Date().toISOString(),
        id: uuid.v4(),
      });
    } catch (e) {
      showToast(e as string);
    }
  };
  const deleteClassStudent = async (id: string) => {
    Keyboard.dismiss();
    try {
      if (id) {
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

  return {
    getClassStudentByStudentId,
    getClassStudentByClassId,
    addNewClassStudent,
    deleteClassStudent,
  };
};

export default useClassStudent;
