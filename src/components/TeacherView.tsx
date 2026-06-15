import React, { useState } from "react";
import { 
  Calendar, 
  Plus, 
  Send, 
  MapPin, 
  Clock, 
  BookOpen, 
  Check, 
  Users, 
  FileText, 
  AlertCircle,
  TrendingUp,
  XCircle,
  HelpCircle,
  Clock3
} from "lucide-react";
import { DaySchedule, Teacher, Group, Homework, LessonRequest } from "../types";
import { MOCK_USERS } from "../mockData";
import { motion, AnimatePresence } from "motion/react";

interface TeacherViewProps {
  schedule: DaySchedule[];
  teachers: Teacher[];
  groups: Group[];
  requests: LessonRequest[];
  setRequests: React.Dispatch<React.SetStateAction<LessonRequest[]>>;
  homework: Homework[];
  setHomework: React.Dispatch<React.SetStateAction<Homework[]>>;
  selectedTeacherId: string;
}

const DAYS_OF_WEEK = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

export default function TeacherView({ 
  schedule, 
  teachers, 
  groups, 
  requests, 
  setRequests,
  homework,
  setHomework,
  selectedTeacherId 
}: TeacherViewProps) {
  const currentTeacher = teachers.find(t => t.id === selectedTeacherId) || teachers[0];

  // State management
  const [activeTab, setActiveTab] = useState<"timetable" | "homework" | "requests">("timetable");
  const [selectedDay, setSelectedDay] = useState<string>("Dushanba");
  
  // States info for homework form
  const [hwTitle, setHwTitle] = useState("");
  const [hwDesc, setHwDesc] = useState("");
  const [hwGroup, setHwGroup] = useState(groups[0]?.id || "");
  const [hwDeadline, setHwDeadline] = useState("2026-06-22");
  const [hwSubject, setHwSubject] = useState("");

  // States for request form
  const [reqLessonId, setReqLessonId] = useState("");
  const [reqType, setReqType] = useState<"cancel" | "swap" | "room_change">("room_change");
  const [reqReason, setReqReason] = useState("");
  const [reqProposedRoom, setReqProposedRoom] = useState("");
  const [reqProposedPair, setReqProposedPair] = useState(1);
  const [msgSuccess, setMsgSuccess] = useState("");

  // Filter schedules taught by this teacher
  const teacherSchedule = schedule.filter(s => s.teacherId === currentTeacher.id);
  const teacherDaySchedule = teacherSchedule.filter(s => s.dayOfWeek === selectedDay);

  // Filter requests sent by this teacher
  const myRequests = requests.filter(r => r.teacherId === currentTeacher.id);

  // Filter homework assigned by this teacher
  const myAssignedHomework = homework.filter(h => h.teacherName === currentTeacher.name);

  // Mock list of students in the taught groups
  const mockedStudents = [
    { id: "st-a", name: "Bobur Mirzayev", group: "512-22 Sun'iy Intellekt", attendance: "96%", score: "92" },
    { id: "st-b", name: "Dilyara Saiduazova", group: "512-22 Sun'iy Intellekt", attendance: "100%", score: "98" },
    { id: "st-c", name: "Javohir To'rayev", group: "512-22 Sun'iy Intellekt", attendance: "88%", score: "78" },
    { id: "st-d", name: "Zaynab Rustamova", group: "512-22 Sun'iy Intellekt", attendance: "92%", score: "85" },
    { id: "st-e", name: "Lazizbek Hasanov", group: "512-22 Sun'iy Intellekt", attendance: "100%", score: "95" },
    { id: "st-f", name: "Farrux Islomov", group: "941-21 AT", attendance: "90%", score: "89" },
    { id: "st-g", name: "Barno Orifjonova", group: "941-21 AT", attendance: "95%", score: "91" },
  ];

  const handleAddHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle || !hwDesc || !hwSubject) return;

    const groupObj = groups.find(g => g.id === hwGroup);
    const newHw: Homework = {
      id: "hw-" + Date.now(),
      groupId: hwGroup,
      subject: hwSubject,
      teacherName: currentTeacher.name,
      title: hwTitle,
      description: hwDesc,
      deadline: hwDeadline,
      status: "pending"
    };

    setHomework(prev => [newHw, ...prev]);
    setHwTitle("");
    setHwDesc("");
    setHwSubject("");
    setMsgSuccess("Yangi uy vazifasi muvaffaqiyatli guruhga e'lon qilindi!");
    setTimeout(() => setMsgSuccess(""), 4000);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqLessonId || !reqReason) return;

    const targetLesson = schedule.find(s => s.id === reqLessonId);
    const newRequest: LessonRequest = {
      id: "req-" + Date.now(),
      teacherId: currentTeacher.id,
      teacherName: currentTeacher.name,
      lessonId: reqLessonId,
      type: reqType,
      reason: reqReason,
      proposedRoom: reqType === "room_change" ? reqProposedRoom : undefined,
      proposedPair: reqType === "swap" ? reqProposedPair : undefined,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setRequests(prev => [newRequest, ...prev]);
    setReqReason("");
    setReqProposedRoom("");
    setMsgSuccess("Dars rejasini ko'chirish/bekor qilish so'rovi muvaffaqiyatli xodimlarga yuborildi!");
    setTimeout(() => setMsgSuccess(""), 4000);
  };

  const currentTaughtGroups = Array.from(new Set(teacherSchedule.map(s => s.groupName)));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Profile summary & Navigation */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100 flex flex-col items-center text-center">
          <div className="relative">
            <img 
              src={MOCK_USERS.find(u => u.id === currentTeacher.id)?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"} 
              alt={currentTeacher.name} 
              className="w-18 h-18 rounded-full border-2 border-emerald-500 object-cover"
            />
            <span className="absolute bottom-0 right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-white"></span>
          </div>

          <h3 className="font-bold text-gray-900 mt-3 text-lg leading-snug">{currentTeacher.name}</h3>
          <p className="text-emerald-700 text-xs font-semibold mt-1">{currentTeacher.department}</p>
          <div className="text-[11px] text-gray-400 mt-2 space-y-1">
            <p>Email: {currentTeacher.email}</p>
            <p>Tel: {currentTeacher.phone}</p>
          </div>

          <div className="w-full border-t border-gray-100 my-4 pt-4 flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("timetable")}
              className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs text-left transition-all flex items-center gap-2 ${
                activeTab === "timetable" 
                  ? "bg-slate-900 text-white shadow-xs" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Mening darslarim
            </button>
            <button
              onClick={() => setActiveTab("homework")}
              className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs text-left transition-all flex items-center gap-2 ${
                activeTab === "homework" 
                  ? "bg-slate-900 text-white shadow-xs" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              Vazifalar berish
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs text-left transition-all flex items-center gap-2 ${
                activeTab === "requests" 
                  ? "bg-slate-900 text-white shadow-xs" 
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Clock3 className="w-4 h-4" />
              O'zgartirish so'rovlari
              {myRequests.filter(r => r.status === "pending").length > 0 && (
                <span className="ml-auto bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {myRequests.filter(r => r.status === "pending").length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Groups statistics */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Siz dars o'tadigan guruhlar</h4>
          {currentTaughtGroups.length === 0 ? (
            <p className="text-gray-450 text-xs py-2">Hozircha guruhlar yuklanmagan</p>
          ) : (
            <div className="space-y-1.5">
              {currentTaughtGroups.map((g, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-semibold text-gray-800">{g}</span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    28 talaba
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main tab content */}
      <div className="lg:col-span-3 space-y-6">
        {msgSuccess && (
          <div className="p-4 bg-emerald-50 text-emerald-800 border-2 border-emerald-250 rounded-2xl flex items-center gap-2.5 text-xs font-semibold">
            <Check className="w-4 h-4 text-emerald-600" />
            {msgSuccess}
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === "timetable" && (
            <motion.div
              key="timetable"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Haftalik pedagogik jadvalingiz
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">Har bir kun bo'yicha rejalashtirilgan mashg'ulotlaringiz</p>
                </div>
              </div>

              {/* Day Buttons */}
              <div className="flex overflow-x-auto gap-1.5 pb-3 scrollbar-hide">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDay === day;
                  const hasLessons = teacherSchedule.some(s => s.dayOfWeek === day);
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative shrink-0 ${
                        isSelected
                          ? "bg-slate-900 text-white shadow-xs"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {day}
                      {hasLessons && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Lesson cards list */}
              <div className="mt-6 space-y-3">
                {teacherDaySchedule.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-14 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <Clock className="w-10 h-10 text-gray-300 mb-2" />
                    <p className="text-gray-500 font-semibold text-sm">{selectedDay} kuni sizda darslar yo'q</p>
                    <p className="text-xs text-gray-400 mt-1">Ilmiy ishlar yoki yozma topshiriqlar bilan band bo'lishingiz mumkin</p>
                  </div>
                ) : (
                  teacherDaySchedule
                    .sort((a,b) => a.pairNumber - b.pairNumber)
                    .map((lesson) => (
                      <div key={lesson.id} className="p-4 bg-slate-50/60 rounded-2xl border border-gray-150 hover:border-emerald-200 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-start gap-3">
                          <span className="w-9 h-9 rounded-xl bg-slate-200/80 text-gray-800 font-bold flex items-center justify-center text-xs">
                            {lesson.pairNumber}-P
                          </span>
                          <div>
                            <p className="font-bold text-gray-900 text-sm sm:text-base leading-snug">{lesson.subject}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Guruh: <span className="font-semibold text-slate-800">{lesson.groupName}</span> | Turi: <span className="italic">{lesson.type}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center text-xs self-stretch sm:self-center justify-between sm:justify-end">
                          <span className="flex items-center gap-1 font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            {lesson.room}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-200">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {lesson.timeStart} - {lesson.timeEnd}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Attending Students Info */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Ushbu guruhlardagi faol talabalar ro'yxati
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-650">
                    <thead>
                      <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] tracking-wider rounded-lg">
                        <th className="py-2.5 px-3">Talaba F.I.O.</th>
                        <th className="py-2.5 px-3">Guruhi</th>
                        <th className="py-2.5 px-3">Davomati</th>
                        <th className="py-2.5 px-3">O'rtacha ball</th>
                        <th className="py-2.5 px-3 text-right">Amal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockedStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/50">
                          <td className="py-3 px-3 font-semibold text-gray-900">{s.name}</td>
                          <td className="py-3 px-3 text-gray-500">{s.group}</td>
                          <td className="py-3 px-3">
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md">{s.attendance}</span>
                          </td>
                          <td className="py-3 px-3 font-mono">{s.score} / 100</td>
                          <td className="py-3 px-3 text-right">
                            <button className="text-[10px] text-emerald-700 hover:underline cursor-pointer">Baholash</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "homework" && (
            <motion.div
              key="homework"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Add form */}
              <div className="md:col-span-1 bg-white rounded-3xl p-5 shadow-xs border border-gray-100 h-fit space-y-4">
                <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100 flex items-center gap-1.5">
                  <Plus className="w-4.5 h-4.5 text-emerald-600" />
                  Yangi vazifa e'lon qilish
                </h3>

                <form onSubmit={handleAddHomework} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Qaysi fandan?</label>
                    <input
                      type="text"
                      required
                      value={hwSubject}
                      onChange={(e) => setHwSubject(e.target.value)}
                      placeholder="Masalan: Sun'iy intellekt asoslari"
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Muvofiq guruhni tanlang</label>
                    <select
                      value={hwGroup}
                      onChange={(e) => setHwGroup(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs bg-white"
                    >
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Vazifa nomi / Sarlavha</label>
                    <input
                      type="text"
                      required
                      value={hwTitle}
                      onChange={(e) => setHwTitle(e.target.value)}
                      placeholder="Pandas orqali data processing..."
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Batafsil tavsif va talablar</label>
                    <textarea
                      required
                      rows={3}
                      value={hwDesc}
                      onChange={(e) => setHwDesc(e.target.value)}
                      placeholder="Algoritmni amalga oshirishda qonuniy kutubxonalardan foydalanmang..."
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Topshirish oxirgi muddati (Deadline)</label>
                    <input
                      type="date"
                      required
                      value={hwDeadline}
                      onChange={(e) => setHwDeadline(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-555 transition-colors text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Guruhga ulashish
                  </button>
                </form>
              </div>

              {/* Already assigned hw */}
              <div className="md:col-span-2 bg-white rounded-3xl p-5 shadow-xs border border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Siz e'lon qilgan faol vazifalar</h3>

                {myAssignedHomework.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400">Hozircha vazifalar tayinlanmagan</div>
                ) : (
                  <div className="space-y-3">
                    {myAssignedHomework.map((hw) => (
                      <div key={hw.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{hw.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 font-semibold">Guruh: {groups.find(g => g.id === hw.groupId)?.name || hw.groupId}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold ${
                            hw.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-orange-50 text-orange-700 border border-orange-100"
                          }`}>
                            {hw.status === "completed" ? "Yopilgan" : "Faol qabul qilinmoqda"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{hw.description}</p>
                        
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-3 pt-3 border-t border-gray-100">
                          <span>Fan: <span className="font-medium text-gray-700">{hw.subject}</span></span>
                          <span className="font-semibold text-orange-850">Mursol: {hw.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "requests" && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {/* Change request form */}
              <div className="md:col-span-1 bg-white rounded-3xl p-5 shadow-xs border border-gray-100 h-fit space-y-4">
                <h3 className="font-bold text-gray-900 text-sm pb-2 border-b border-gray-100 flex items-center gap-1.5">
                  <AlertCircle className="w-4.5 h-4.5 text-emerald-600" />
                  Dars o'zgartirish talabi
                </h3>

                <form onSubmit={handleSendRequest} className="space-y-3.5 text-xs bg-white">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Muvofiq darsingizni tanlang</label>
                    <select
                      value={reqLessonId}
                      required
                      onChange={(e) => setReqLessonId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs bg-white"
                    >
                      <option value="">-- Darsni tanlang --</option>
                      {teacherSchedule.map(s => (
                        <option key={s.id} value={s.id}>
                          [{s.dayOfWeek} | {s.pairNumber}-para] {s.subject} ({s.groupName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">So'rov turi</label>
                    <div className="grid grid-cols-3 gap-1 bg-gray-50 p-1 rounded-xl">
                      {(["room_change", "cancel", "swap"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setReqType(type)}
                          className={`py-1.5 rounded-lg text-[10px] font-bold text-center transition-all ${
                            reqType === type 
                              ? "bg-white text-gray-950 shadow-2xs" 
                              : "text-gray-500 hover:text-gray-950"
                          }`}
                        >
                          {type === "room_change" ? "Xona o'zg." : type === "cancel" ? "Qoldirish" : "Para o'zg."}
                        </button>
                      ))}
                    </div>
                  </div>

                  {reqType === "room_change" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Taklif qilinayotgan yangi xona</label>
                      <input
                        type="text"
                        required
                        value={reqProposedRoom}
                        onChange={(e) => setReqProposedRoom(e.target.value)}
                        placeholder="Masalan: 304-Laboratoriya xonasi"
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none text-xs"
                      />
                    </div>
                  )}

                  {reqType === "swap" && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">Taklif qilinayotgan yangi para raqami</label>
                      <select
                        value={reqProposedPair}
                        onChange={(e) => setReqProposedPair(parseInt(e.target.value))}
                        className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none text-xs bg-white"
                      >
                        {[1, 2, 3, 4, 5].map(p => (
                          <option key={p} value={p}>{p}-paralik dars vaqti</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Sababini batafsil yozing</label>
                    <textarea
                      required
                      rows={3}
                      value={reqReason}
                      onChange={(e) => setReqReason(e.target.value)}
                      placeholder="Masalan: Kafedra yig'ilishi sababli..."
                      className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 transition-colors text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    So'rov yuborish
                  </button>
                </form>
              </div>

              {/* Requests history */}
              <div className="md:col-span-2 bg-white rounded-3xl p-5 shadow-xs border border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm mb-4">Siz yuborgan o'zgartirish so'rovlari va statuslari</h3>

                {myRequests.length === 0 ? (
                  <div className="text-center py-12 text-xs text-gray-400">Yuborilgan so'rovlar topilmadi</div>
                ) : (
                  <div className="space-y-3">
                    {myRequests.map((req) => {
                      const lesson = schedule.find(s => s.id === req.lessonId);
                      return (
                        <div key={req.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                                req.type === "room_change" ? "bg-blue-50 text-blue-700" : req.type === "cancel" ? "bg-red-50 text-red-700" : "bg-purple-50 text-purple-700"
                              }`}>
                                {req.type === "room_change" ? "Xona o'zgartirish" : req.type === "cancel" ? "Dars qoldirish" : "Vaqt almashtirish"}
                              </span>
                              <span className="text-xs font-semibold text-slate-800">
                                {lesson ? lesson.subject : "Dars aniqlanmadi"}
                              </span>
                            </div>

                            <p className="text-xs text-gray-650 leading-relaxed max-w-lg">
                              <strong>Sabab:</strong> {req.reason}
                            </p>
                            
                            {req.proposedRoom && (
                              <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                                <Plus className="w-3.5 h-3.5" /> Taklif xona: {req.proposedRoom}
                              </p>
                            )}

                            {req.proposedPair && (
                              <p className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                                <Plus className="w-3.5 h-3.5" /> Taklif para: {req.proposedPair}-para
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold leading-none ${
                              req.status === "pending" 
                                ? "bg-amber-50 text-amber-700 border border-amber-100 animate-pulse" 
                                : req.status === "approved" 
                                ? "bg-emerald-55 text-emerald-800 border border-emerald-100" 
                                : "bg-red-50 text-red-750 border border-red-100"
                            }`}>
                              {req.status === "pending" ? "Kutilmoqda" : req.status === "approved" ? "Tasdiqlandi" : "Rad etildi"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
