import { Keyboard, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { useCallback } from 'react';

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

const useAttendance = () => {
  const getAttendanceArr = async () => {
    const attendanceStr = await AsyncStorage.getItem('attendance');
    const attendanceArr = JSON.parse(attendanceStr || '[]');
    return attendanceArr.filter((item: I_Attendance) => !item.isDeleted);
  };
  const getStudentAttendanceToday = async (
    studentId: string,
    classId: string,
  ) => {
    const attendanceArr = await getAttendanceArr();
    const foundAttendance = attendanceArr.find(
      (item: I_Attendance) =>
        item.classId === classId ||
        item.studentId === studentId ||
        new Date(item.createdAt || '') === new Date(),
    );
    const foundAttendanceIndex = attendanceArr.findIndex(
      (item: I_Attendance) =>
        item.classId === classId ||
        item.studentId === studentId ||
        new Date(item.createdAt || '') === new Date(),
    );
    return {
      foundAttendance: foundAttendance,
      foundAttendanceIndex: foundAttendanceIndex,
    } as I_Get_Attendance_Result;
  };
  const addNewAttendance = async (classId: string, studentId: string) => {
    Keyboard.dismiss();
    try {
      if (classId === '' || studentId === '') {
        throw 'Required fields are empty';
      }
      const attendanceArr = await getAttendanceArr();
      const isValidClassStudent = attendanceArr.find(
        (item: I_Attendance) =>
          item.classId === classId || item.studentId === studentId,
      );
      if (!isValidClassStudent) {
        throw 'Student does not registered in this class';
      }
      const { foundAttendance } = await getStudentAttendanceToday(
        classId,
        studentId,
      );
      if (foundAttendance) {
        throw 'Student already have an attendance to this class today';
      }
      const toSaveClasses: I_Attendance[] = [
        ...attendanceArr,
        {
          classId,
          studentId,
          createdAt: new Date().toISOString(),
          id: uuid.v4(),
        },
      ];
      const toSaveClassesStr = JSON.stringify(toSaveClasses);
      await AsyncStorage.setItem('attendance', toSaveClassesStr);
      showToast('Scanned successfully');
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

  return {
    getClassAttendanceByDate,
    addNewAttendance,
  };
};

export default useAttendance;
