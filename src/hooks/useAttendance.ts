import {
  Keyboard,
  ToastAndroid,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useCallback, useEffect, useState } from 'react';
import { getStudentsArr, I_Student } from './useStudents';
import { getClassStudentsArr } from './useClassStudents';
import { getClassesArr, I_Class } from './useClasses';
import moment from 'moment';
const DirectSms = NativeModules.DirectSms;

type I_Student_Attendance = {
  className: string;
  createdAt: string;
};

export interface I_Attendance {
  id?: string;
  studentId: string;
  classId: string;
  createdAt?: string;
  isDeleted?: string;
}

export interface I_Get_Attendance_Result {
  foundAttendance: I_Attendance;
  foundAttendanceIndex: number;
}

const showToast = (value: string) => {
  ToastAndroid.showWithGravity(value, ToastAndroid.LONG, ToastAndroid.BOTTOM);
};

const sendDirectSms = async (phoneNumber: string, message: string) => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      {
        title: 'YourProject App Sms Permission',
        message:
          'YourProject App needs access to your inbox ' +
          'so you can send messages in background.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      DirectSms.sendDirectSms(phoneNumber, message);
    } else {
      showToast('SMS permission denied');
    }
  } catch (err) {
    showToast(err as string);
  }
};

const useAttendance = () => {
  const [studentAttendance, setStudentAttendance] = useState<
    I_Student_Attendance[]
  >([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const getAttendanceArr = async () => {
    const attendanceStr = await AsyncStorage.getItem('attendance');
    const attendanceArr = JSON.parse(attendanceStr || '[]');
    return attendanceArr.filter((item: I_Attendance) => !item.isDeleted);
  };
  const getStudentAttendanceToday = async (
    classId: string,
    studentId: string,
  ) => {
    const attendanceArr = await getAttendanceArr();
    const foundAttendance = attendanceArr.find(
      (item: I_Attendance) =>
        item.classId === classId &&
        item.studentId === studentId &&
        new Date(item.createdAt || '').toISOString().substring(0, 10) ===
          new Date().toISOString().substring(0, 10),
    );
    const foundAttendanceIndex = attendanceArr.findIndex(
      (item: I_Attendance) =>
        item.classId === classId &&
        item.studentId === studentId &&
        new Date(item.createdAt || '').toISOString().substring(0, 10) ===
          new Date().toISOString().substring(0, 10),
    );
    return {
      foundAttendance: foundAttendance,
      foundAttendanceIndex: foundAttendanceIndex,
    } as I_Get_Attendance_Result;
  };
  const sendSms = (
    guardianPhoneNumber: string,
    fullName: string,
    className: string,
  ) => {
    sendDirectSms(
      guardianPhoneNumber,
      `${fullName} has been recorded as present in subject name ${className}`,
    );
  };
  const addNewAttendance = async (
    classId: string,
    studentNumber: string,
    className: string,
  ) => {
    Keyboard.dismiss();
    try {
      if (classId === '' || studentNumber === '') {
        throw 'Required fields are empty';
      }
      const studentArr = await getStudentsArr();
      const selectedStudent = studentArr.find(
        (item: I_Student) => item.studentNumber === studentNumber,
      );
      const attendanceArr = await getAttendanceArr();
      const classStudentArr = await getClassStudentsArr();
      const isValidClassStudent = classStudentArr.find(
        (item: I_Attendance) =>
          item.classId === classId || item.studentId === selectedStudent.id,
      );
      if (!isValidClassStudent) {
        throw 'Student is not registered in this class';
      }
      const { foundAttendance } = await getStudentAttendanceToday(
        classId,
        selectedStudent.id,
      );
      if (foundAttendance) {
        sendSms(
          selectedStudent.guardianPhoneNumber,
          `${selectedStudent.firstName} ${selectedStudent.lastName}`,
          className,
        );
        throw 'Student already have an attendance to this class today';
      }
      const toSaveClasses: I_Attendance[] = [
        ...attendanceArr,
        {
          classId,
          studentId: selectedStudent.id,
          createdAt: new Date(),
          id: uuid.v4(),
        },
      ];
      const toSaveClassesStr = JSON.stringify(toSaveClasses);
      await AsyncStorage.setItem('attendance', toSaveClassesStr);
      if (selectedStudent) {
        sendSms(
          selectedStudent.guardianPhoneNumber,
          `${selectedStudent.firstName} ${selectedStudent.lastName}`,
          className,
        );
        showToast('Student recorded as present');
      } else {
        showToast('Student not found');
      }
    } catch (e) {
      showToast(e as string);
    }
  };

  const getClassAttendanceByDate = useCallback(
    async (classId: string, date: string) => {
      const attendanceArr = await getAttendanceArr();
      const foundAttendance = attendanceArr.find(
        (item: I_Attendance) =>
          item.classId === classId ||
          new Date(item.createdAt || '') === new Date(date),
      );
      return foundAttendance;
    },
    [],
  );

  const getStudentAttendanceByStudentId = useCallback(
    async (studentId: string) => {
      const attendanceArr = await getAttendanceArr();
      const classesArr: I_Class[] = await getClassesArr();
      const foundAttendance = attendanceArr.filter(
        (item: I_Attendance) => item.studentId === studentId,
      );
      const studentAttendanceFormatted = foundAttendance.map(
        (item: I_Attendance) => {
          const foundClass = classesArr.find(
            (classItem: I_Class) => classItem.id === item.classId,
          );
          const date = moment(item.createdAt).fromNow();
          return {
            className: foundClass?.name,
            createdAt: date,
          };
        },
      );
      setStudentAttendance(studentAttendanceFormatted.reverse());
    },
    [],
  );

  useEffect(() => {
    if (selectedStudentId) {
      getStudentAttendanceByStudentId(selectedStudentId);
    }
  }, [selectedStudentId, getStudentAttendanceByStudentId]);

  const getStudentAttendance = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  return {
    getClassAttendanceByDate,
    addNewAttendance,
    studentAttendance,
    getStudentAttendance,
  };
};

export default useAttendance;
