export type Role = "admin" | "student" | "teacher" | "staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  group?: string; // for students (e.g. "941-21", "942-21")
  department?: string; // for teachers/staff (e.g. "Axborot Texnologiyalari", "Oliy Matematika")
  avatar?: string;
}

export interface DaySchedule {
  id: string;
  groupId: string;
  groupName: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  room: string;
  dayOfWeek: string; // "Dushanba" | "Seshanba" | "Chorshanba" | "Payshanba" | "Juma" | "Shanba"
  pairNumber: number; // 1, 2, 3, 4, 5
  timeStart: string; // "08:30"
  timeEnd: string; // "09:50"
  type: "Ma'ruza" | "Amaliyot" | "Laboratoriya" | "Seminar";
}

export interface Teacher {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
}

export interface Group {
  id: string;
  name: string;
  faculty: string;
  studentCount: number;
}

export interface Room {
  id: string;
  name: string; // "302-xona", "Axborot Texnologiyalari markazi"
  capacity: number;
  type: "Ma'ruza xonasi" | "Kompyuter xonasi" | "Laboratoriya";
}

export interface LessonRequest {
  id: string;
  teacherId: string;
  teacherName: string;
  lessonId: string;
  type: "cancel" | "swap" | "room_change";
  reason: string;
  proposedDate?: string;
  proposedPair?: number;
  proposedRoom?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface Homework {
  id: string;
  groupId: string;
  subject: string;
  teacherName: string;
  title: string;
  description: string;
  deadline: string;
  status: "pending" | "completed";
}

export interface SystemLog {
  id: string;
  user: string;
  action: string;
  time: string;
  role: Role;
}
