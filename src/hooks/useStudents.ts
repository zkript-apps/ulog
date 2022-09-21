import { Keyboard, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import uuid from 'react-native-uuid';
import useClassStudent from './useClassStudents';

export interface I_Student {
  id?: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  guardianPhoneNumber: string;
  updatedAt?: string;
  createdAt?: string;
  isDeleted?: string;
}

export interface I_Get_Student_Result {
  foundStudent: I_Student;
  foundStudentIndex: number;
}

const showToast = (value: string) => {
  ToastAndroid.showWithGravity(value, ToastAndroid.LONG, ToastAndroid.BOTTOM);
};

const getStudentsArr = async () => {
  const studentsStr = await AsyncStorage.getItem('students');
  const studentsArr = JSON.parse(studentsStr || '[]');
  return studentsArr;
};

const getStudentById = async (id: string) => {
  const studentsArr = await getStudentsArr();
  const foundStudent = studentsArr.find((item: I_Student) => item.id === id);
  const foundStudentIndex: number = studentsArr.findIndex(
    (item: I_Student) => item.id === id,
  );
  return {
    foundStudent: foundStudent,
    foundStudentIndex: foundStudentIndex,
  } as I_Get_Student_Result;
};

const getStudentByNumber = async (studentNumber: string) => {
  const studentsArr = await getStudentsArr();
  const foundStudent = studentsArr.find(
    (item: I_Student) => item.studentNumber === studentNumber,
  );
  const foundStudentIndex: number = studentsArr.findIndex(
    (item: I_Student) => item.studentNumber === studentNumber,
  );
  return {
    foundStudent: foundStudent,
    foundStudentIndex: foundStudentIndex,
  } as I_Get_Student_Result;
};

const useStudents = () => {
  const navigation: any = useNavigation();
  const { addNewClassStudent } = useClassStudent();
  const [student, setStudent] = useState<I_Student>({
    firstName: '',
    lastName: '',
    guardianPhoneNumber: '',
    studentNumber: '',
  });
  const [students, setStudents] = useState<I_Student[]>([]);
  const resetStudent = () => {
    setStudent({
      firstName: '',
      lastName: '',
      guardianPhoneNumber: '',
      studentNumber: '',
    });
  };
  const addNewStudent = async (classId?: string, className?: string) => {
    Keyboard.dismiss();
    try {
      if (
        student.firstName === '' ||
        student.lastName === '' ||
        student.guardianPhoneNumber === '' ||
        student.studentNumber === ''
      ) {
        throw 'All inputs are required';
      }
      const studentsArr = await getStudentsArr();
      const { foundStudent } = await getStudentByNumber(
        student?.studentNumber || '',
      );
      if (foundStudent) {
        throw 'Student already exist';
      }
      const recordId = uuid.v4();
      const toSaveStudents: I_Student[] = [
        ...studentsArr,
        { ...student, createdAt: new Date().toISOString(), id: recordId },
      ];
      const toSaveStudentsStr = JSON.stringify(toSaveStudents);
      await AsyncStorage.setItem('students', toSaveStudentsStr);
      if (classId) {
        addNewClassStudent(classId, recordId as string);
      }
      console.log('Student add: ', {
        ...student,
        createdAt: new Date().toISOString(),
        id: recordId,
      });
      showToast('Student added');
      resetStudent();
      if (navigation.canGoBack() && (!classId || !className)) {
        navigation.goBack();
      } else if (classId && className) {
        navigation.navigate({
          name: 'ClassStudents',
          params: { id: classId, name: className },
        });
      }
    } catch (e) {
      showToast(e as string);
    }
  };
  const updateStudent = async (id: string) => {
    Keyboard.dismiss();
    try {
      if (
        !student?.firstName ||
        !student?.lastName ||
        !student?.guardianPhoneNumber ||
        !student?.studentNumber
      ) {
        throw 'All inputs are required';
      }
      const studentsArr = await getStudentsArr();
      const { foundStudent } = await getStudentByNumber(student.studentNumber);
      if (
        foundStudent &&
        foundStudent.id === id &&
        foundStudent.firstName === student.firstName &&
        foundStudent.lastName === student.lastName &&
        foundStudent.guardianPhoneNumber === student.guardianPhoneNumber &&
        foundStudent.studentNumber === student.studentNumber
      ) {
        throw 'Please change any input';
      }
      const { foundStudentIndex: studentIndex } = await getStudentById(id);
      studentsArr[studentIndex].firstName = student.firstName;
      studentsArr[studentIndex].lastName = student.lastName;
      studentsArr[studentIndex].guardianPhoneNumber =
        student.guardianPhoneNumber;
      studentsArr[studentIndex].studentNumber = student.studentNumber;
      studentsArr[studentIndex].updatedAt = new Date().toISOString();
      const updatedClassesStr = JSON.stringify(studentsArr);
      await AsyncStorage.setItem('students', updatedClassesStr);
      showToast('Student updated');
      resetStudent();
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (e) {
      showToast(e as string);
    }
  };
  const deleteStudent = async (id: string) => {
    Keyboard.dismiss();
    try {
      if (id) {
        throw 'Student Id is required to delete';
      }
      const studentsArr = await getStudentsArr();
      const { foundStudent } = await getStudentByNumber(
        student?.studentNumber || '',
      );
      if (foundStudent?.isDeleted) {
        throw 'Student already deleted';
      }
      const { foundStudentIndex: studentIndex } = await getStudentById(id);
      studentsArr[studentIndex].isDeleted = new Date().toISOString();
      const updatedClassesStr = JSON.stringify(studentsArr);
      await AsyncStorage.setItem('classes', updatedClassesStr);
      showToast('Student updated');
      resetStudent();
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (e) {
      showToast(e as string);
    }
  };
  const getStudents = async () => {
    const studentsArr = await getStudentsArr();
    setStudents(studentsArr.reverse());
  };
  useEffect(() => {
    getStudents();
  }, []);

  return {
    addNewStudent,
    student,
    setStudent,
    updateStudent,
    deleteStudent,
    students,
    getStudents,
    getStudentByNumber,
  };
};

export default useStudents;
