import React, { useState, useEffect } from "react";
import { 
  Users, 
  Layers, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  UserCheck, 
  Info,
  Clock,
  LogOut,
  Sliders,
  Bell
} from "lucide-react";
import { 
  MOCK_USERS, 
  MOCK_TEACHERS, 
  MOCK_GROUPS, 
  MOCK_ROOMS, 
  MOCK_SCHEDULE, 
  MOCK_HOMEWORK, 
  MOCK_REQUESTS, 
  MOCK_LOGS 
} from "./mockData";
import { User, DaySchedule, Teacher, Group, Room, LessonRequest, Homework, SystemLog, Role } from "./types";
import StudentView from "./components/StudentView";
import TeacherView from "./components/TeacherView";
import StaffView from "./components/StaffView";
import AdminPanel from "./components/AdminPanel";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Load persistent states or fallback to mock data
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("jadval_users");
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    const saved = localStorage.getItem("jadval_schedule");
    return saved ? JSON.parse(saved) : MOCK_SCHEDULE;
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const saved = localStorage.getItem("jadval_teachers");
    return saved ? JSON.parse(saved) : MOCK_TEACHERS;
  });

  const [groups, setGroups] = useState<Group[]>(() => {
    const saved = localStorage.getItem("jadval_groups");
    return saved ? JSON.parse(saved) : MOCK_GROUPS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem("jadval_rooms");
    return saved ? JSON.parse(saved) : MOCK_ROOMS;
  });

  const [requests, setRequests] = useState<LessonRequest[]>(() => {
    const saved = localStorage.getItem("jadval_requests");
    return saved ? JSON.parse(saved) : MOCK_REQUESTS;
  });

  const [homework, setHomework] = useState<Homework[]>(() => {
    const saved = localStorage.getItem("jadval_homework");
    return saved ? JSON.parse(saved) : MOCK_HOMEWORK;
  });

  const [logs, setLogs] = useState<SystemLog[]>(() => {
    const saved = localStorage.getItem("jadval_logs");
    return saved ? JSON.parse(saved) : MOCK_LOGS;
  });

  // Simulator Persona controller
  const [currentUser, setCurrentUser] = useState<User>(() => {
    // Default logged in is student Lazizbek
    return users.find(u => u.role === "student") || users[0];
  });

  // Clock state
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Sync to database local states
  useEffect(() => {
    localStorage.setItem("jadval_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("jadval_schedule", JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem("jadval_teachers", JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem("jadval_groups", JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem("jadval_rooms", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem("jadval_requests", JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem("jadval_homework", JSON.stringify(homework));
  }, [homework]);

  useEffect(() => {
    localStorage.setItem("jadval_logs", JSON.stringify(logs));
  }, [logs]);

  // Handle Switching Persona
  const handleSwitchPersona = (userId: string) => {
    const userObj = users.find(u => u.id === userId);
    if (userObj) {
      setCurrentUser(userObj);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 selection:bg-emerald-200">
      
      {/* Floating Interactive Role Simulator Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-xl text-white">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-400 block tracking-wider uppercase">Interaktiv Rol Simulyatori</span>
              <span className="text-[10px] text-gray-400">Rollar o'rtasida darhol o'tib dars jadvali yangilanishini kuzating:</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 items-center bg-slate-800 p-1 rounded-2xl border border-slate-700">
            {users.map((user) => {
              const isActive = currentUser.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => handleSwitchPersona(user.id)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive 
                      ? "bg-emerald-600 text-white shadow-sm" 
                      : "text-gray-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <img src={user.avatar} className="w-4.5 h-4.5 rounded-full object-cover border border-white/20" alt="av" />
                  <span>{user.name.split(" ")[0]} ({user.role === "admin" ? "Admin" : user.role === "staff" ? "Xodim" : user.role === "teacher" ? "O'qituvchi" : "Talaba"})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header Branding */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm tracking-wide bg-emerald-50 px-3 py-1.5 rounded-full w-fit border border-emerald-100">
              <Calendar className="w-4 h-4" />
              TUIT Intellektual Tizimi
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mt-2.5">
              Aqlli Dars Jadvali Platformasi
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sun'iy intellekt (Gemini 3.5-Flash) yordamida shakllantiriluvchi, optimallashtiruvchi dars jadvallari vasiqasi
            </p>
          </div>

          {/* Clock widget */}
          <div className="bg-white px-5 py-3.5 rounded-2xl border border-gray-150 shadow-2xs flex items-center gap-3 shrink-0">
            <Clock className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hozirgi Vaqt (Haqiqiy)</p>
              <p className="font-mono text-base font-bold text-gray-900 tracking-wider mt-0.5">{timeStr || "00:00:00"}</p>
            </div>
          </div>
        </header>

        {/* Current Active User Banner Info */}
        <div className="bg-emerald-50/70 border border-emerald-150 p-4.5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-2xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Siz hozir ushbu profil ostida ishlayapsiz:</p>
              <p className="font-bold text-gray-900 text-base flex items-center gap-2">
                {currentUser.name}
                <span className="text-xs font-bold px-2 py-0.5 bg-slate-900 text-white rounded-lg uppercase">
                  {currentUser.role === "admin" ? "Administrator" : currentUser.role === "staff" ? "O'quv bo'limi xodimi" : currentUser.role === "teacher" ? "Kafedra o'qituvchisi" : "Talaba"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/60 px-3 py-1.5 rounded-xl border border-gray-100">
            <Info className="w-4 h-4 text-emerald-600" />
            <span>Yuqoridagi Simulyator paneli yordamida bemalol boshqa rolga o'ting!</span>
          </div>
        </div>

        {/* Dynamic Route/View Mounting */}
        <main className="pb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUser.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {currentUser.role === "student" && (
                <StudentView 
                  schedule={schedule}
                  homework={homework}
                  setHomework={setHomework}
                  studentGroup={currentUser.group || "512-22 Sun'iy Intellekt"}
                />
              )}

              {currentUser.role === "teacher" && (
                <TeacherView 
                  schedule={schedule}
                  teachers={teachers}
                  groups={groups}
                  requests={requests}
                  setRequests={setRequests}
                  homework={homework}
                  setHomework={setHomework}
                  selectedTeacherId={currentUser.id}
                />
              )}

              {currentUser.role === "staff" && (
                <StaffView 
                  schedule={schedule}
                  setSchedule={setSchedule}
                  teachers={teachers}
                  groups={groups}
                  rooms={rooms}
                  requests={requests}
                  setRequests={setRequests}
                  logs={logs}
                  setLogs={setLogs}
                />
              )}

              {currentUser.role === "admin" && (
                <AdminPanel 
                  users={users}
                  setUsers={setUsers}
                  teachers={teachers}
                  setTeachers={setTeachers}
                  groups={groups}
                  setGroups={setGroups}
                  rooms={rooms}
                  setRooms={setRooms}
                  logs={logs}
                  setLogs={setLogs}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-8 pb-12 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
          <p>© 2026 Aqlli Dars Jadvali Tizimi. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-6">
            <span className="hover:text-gray-905 cursor-pointer">Yordam</span>
            <span className="hover:text-gray-905 cursor-pointer">Xavfsizlik yo'riqnomasi</span>
            <span className="hover:text-gray-905 cursor-pointer">Foydalanish qoidalari</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
