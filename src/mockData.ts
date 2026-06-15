import { DaySchedule, Teacher, Group, Room, Homework, LessonRequest, User, SystemLog } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: "admin-1",
    name: "Diyorbek Mo'minjonov",
    email: "diyorbekmominjonov43@gmail.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "staff-1",
    name: "Soliho'ja Alisherov",
    email: "solihoja@darsjadval.uz",
    role: "staff",
    department: "O'quv bo'limi xodimi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "teacher-1",
    name: "Dr. Elyor Mardonov",
    email: "e.mardonov@tuit.uz",
    role: "teacher",
    department: "Dasturiy injiniring kafedrasi",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "teacher-2",
    name: "Prof. Zilola Karimova",
    email: "z.karimova@tuit.uz",
    role: "teacher",
    department: "Sun'iy intellekt kafedrasi",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "teacher-3",
    name: "Sardor Alijonov",
    email: "s.alijonov@tuit.uz",
    role: "teacher",
    department: "Axborot xavfsizligi",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  },
  {
    id: "student-1",
    name: "Lazizbek Hasanov",
    email: "laziz.hasanov@student.uz",
    role: "student",
    group: "512-22 Sun'iy Intellekt",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
  }
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: "teacher-1", name: "Dr. Elyor Mardonov", department: "Dasturiy injiniring", email: "e.mardonov@tuit.uz", phone: "+998 90 123-4567" },
  { id: "teacher-2", name: "Prof. Zilola Karimova", department: "Sun'iy intellekt", email: "z.karimova@tuit.uz", phone: "+998 93 321-7654" },
  { id: "teacher-3", name: "Sardor Alijonov", department: "Axborot xavfsizligi", email: "s.alijonov@tuit.uz", phone: "+998 94 999-1122" },
  { id: "teacher-4", name: "Behzod Usmonov", department: "Oliy Matematika", email: "b.usmonov@tuit.uz", phone: "+998 91 777-8899" },
  { id: "teacher-5", name: "Madina Yusupova", department: "Xorijiy tillar", email: "m.yusupova@tuit.uz", phone: "+998 97 444-5566" },
];

export const MOCK_GROUPS: Group[] = [
  { id: "g1", name: "512-22 Sun'iy Intellekt", faculty: "Dasturiy texnologiyalar", studentCount: 28 },
  { id: "g2", name: "941-21 AT", faculty: "Kompyuter injiniringi", studentCount: 30 },
  { id: "g3", name: "942-21 AT", faculty: "Kompyuter injiniringi", studentCount: 26 },
  { id: "g4", name: "711-20 Iqtisodiyot", faculty: "Raqamli iqtisodiyot", studentCount: 24 },
];

export const MOCK_ROOMS: Room[] = [
  { id: "101", name: "101-Kompyuter xonasi", capacity: 30, type: "Kompyuter xonasi" },
  { id: "205", name: "205-Ma'ruzalar zali", capacity: 120, type: "Ma'ruza xonasi" },
  { id: "304", name: "304-Laboratoriya xonasi", capacity: 25, type: "Laboratoriya" },
  { id: "102", name: "102-Fizika lab", capacity: 20, type: "Laboratoriya" },
  { id: "310", name: "310-Kichik seminar xonasi", capacity: 40, type: "Ma'ruza xonasi" },
];

export const MOCK_SCHEDULE: DaySchedule[] = [
  // 512-22 Sun'iy Intellekt schedules
  {
    id: "s1",
    groupId: "g1",
    groupName: "512-22 Sun'iy Intellekt",
    subject: "Ma'lumotlar tahlili va Machine Learning",
    teacherId: "teacher-1",
    teacherName: "Dr. Elyor Mardonov",
    room: "101-Kompyuter xonasi",
    dayOfWeek: "Dushanba",
    pairNumber: 1,
    timeStart: "08:30",
    timeEnd: "09:50",
    type: "Amaliyot"
  },
  {
    id: "s2",
    groupId: "g1",
    groupName: "512-22 Sun'iy Intellekt",
    subject: "Sun'iy intellekt asoslari",
    teacherId: "teacher-2",
    teacherName: "Prof. Zilola Karimova",
    room: "205-Ma'ruzalar zali",
    dayOfWeek: "Dushanba",
    pairNumber: 2,
    timeStart: "10:00",
    timeEnd: "11:20",
    type: "Ma'ruza"
  },
  {
    id: "s3",
    groupId: "g1",
    groupName: "512-22 Sun'iy Intellekt",
    subject: "Kriptografiya",
    teacherId: "teacher-3",
    teacherName: "Sardor Alijonov",
    room: "304-Laboratoriya xonasi",
    dayOfWeek: "Seshanba",
    pairNumber: 2,
    timeStart: "10:00",
    timeEnd: "11:20",
    type: "Laboratoriya"
  },
  {
    id: "s4",
    groupId: "g1",
    groupName: "512-22 Sun'iy Intellekt",
    subject: "Oliy Matematika",
    teacherId: "teacher-4",
    teacherName: "Behzod Usmonov",
    room: "310-Kichik seminar xonasi",
    dayOfWeek: "Chorshanba",
    pairNumber: 1,
    timeStart: "08:30",
    timeEnd: "09:50",
    type: "Amaliyot"
  },
  {
    id: "s5",
    groupId: "g1",
    groupName: "512-22 Sun'iy Intellekt",
    subject: "Ma'lumotlar tahlili va Machine Learning",
    teacherId: "teacher-1",
    teacherName: "Dr. Elyor Mardonov",
    room: "205-Ma'ruzalar zali",
    dayOfWeek: "Chorshanba",
    pairNumber: 3,
    timeStart: "11:30",
    timeEnd: "12:50",
    type: "Ma'ruza"
  },
  {
    id: "s6",
    groupId: "g1",
    groupName: "512-22 Sun'iy Intellekt",
    subject: "Ingliz tili (IELTS prep)",
    teacherId: "teacher-5",
    teacherName: "Madina Yusupova",
    room: "310-Kichik seminar xonasi",
    dayOfWeek: "Payshanba",
    pairNumber: 1,
    timeStart: "08:30",
    timeEnd: "09:50",
    type: "Seminar"
  },
  {
    id: "s7",
    groupId: "g1",
    groupName: "512-22 Sun'iy Intellekt",
    subject: "Sun'iy intellekt asoslari",
    teacherId: "teacher-2",
    teacherName: "Prof. Zilola Karimova",
    room: "101-Kompyuter xonasi",
    dayOfWeek: "Juma",
    pairNumber: 2,
    timeStart: "10:00",
    timeEnd: "11:20",
    type: "Amaliyot"
  },

  // 941-21 AT schedules
  {
    id: "s8",
    groupId: "g2",
    groupName: "941-21 AT",
    subject: "Ma'lumotlar tahlili va Machine Learning",
    teacherId: "teacher-1",
    teacherName: "Dr. Elyor Mardonov",
    room: "205-Ma'ruzalar zali",
    dayOfWeek: "Seshanba",
    pairNumber: 1,
    timeStart: "08:30",
    timeEnd: "09:50",
    type: "Ma'ruza"
  },
  {
    id: "s9",
    groupId: "g2",
    groupName: "941-21 AT",
    subject: "Kriptografiya",
    teacherId: "teacher-3",
    teacherName: "Sardor Alijonov",
    room: "304-Laboratoriya xonasi",
    dayOfWeek: "Payshanba",
    pairNumber: 2,
    timeStart: "10:00",
    timeEnd: "11:20",
    type: "Laboratoriya"
  }
];

export const MOCK_HOMEWORK: Homework[] = [
  {
    id: "hw1",
    groupId: "g1",
    subject: "Ma'lumotlar tahlili va Machine Learning",
    teacherName: "Dr. Elyor Mardonov",
    title: "Pandas va NumPy kutubxonalari",
    description: "Berilgan CSV faylni ochib, undagi xatoliklarni tozalash va to'g'ri ko'rinishga keltirish. Pandas kutubxonasi yordamida groupby va pivot_table funksiyalarini qo'llash.",
    deadline: "2026-06-20",
    status: "pending"
  },
  {
    id: "hw2",
    groupId: "g1",
    subject: "Sun'iy intellekt asoslari",
    teacherName: "Prof. Zilola Karimova",
    title: "A* Qidiruv Algoritmini tuzish",
    description: "Taqdim etilgan graf matritsasida A* qidiruv algoritmini Python-da qo'lda hech qanday AI kutubxonasiz yozib, eng qisqa yo'lni topish dasturini yaratish.",
    deadline: "2026-06-18",
    status: "pending"
  },
  {
    id: "hw3",
    groupId: "g1",
    subject: "Kriptografiya",
    teacherName: "Sardor Alijonov",
    title: "AES 128 Algoritmi tadqiqoti",
    description: "AES 128 shifrlash algoritmining turlari va S-Box shakllanish prinsiplari haqida 3 betlik ma'ruza tayyorlash.",
    deadline: "2026-06-25",
    status: "completed"
  }
];

export const MOCK_REQUESTS: LessonRequest[] = [
  {
    id: "r1",
    teacherId: "teacher-1",
    teacherName: "Dr. Elyor Mardonov",
    lessonId: "s1",
    type: "room_change",
    reason: "101-Kompyuter xonasida proyektor ishlamayapti, slayd ko'rsatish zarur.",
    proposedRoom: "102-Fizika lab",
    status: "pending",
    createdAt: "2026-06-14T15:30:00"
  },
  {
    id: "r2",
    teacherId: "teacher-3",
    teacherName: "Sardor Alijonov",
    lessonId: "s3",
    type: "cancel",
    reason: "Xizmat safari sababli",
    status: "approved",
    createdAt: "2026-06-13T10:00:00"
  }
];

export const MOCK_LOGS: SystemLog[] = [
  { id: "log-1", user: "Soliho'ja Alisherov", action: "Seshanba kuni 2-para Kriptografiya darsini shakllantirdi", time: "2026-06-15 09:20", role: "staff" },
  { id: "log-2", user: "Dr. Elyor Mardonov", action: "Dushanba kungi 1-para xonasini o'zgartirish so'rovini yubordi", time: "2026-06-15 08:15", role: "teacher" },
  { id: "log-3", user: "Diyorbek Mo'minjonov", action: "O'qituvchilar ro'yxatiga 'Madina Yusupova'ni qo'shdi", time: "2026-06-14 17:30", role: "admin" },
  { id: "log-4", user: "Soliho'ja Alisherov", action: "512-22 Sun'iy Intellekt guruhining dars jadvalini e'lon qildi", time: "2026-06-14 12:00", role: "staff" },
];
