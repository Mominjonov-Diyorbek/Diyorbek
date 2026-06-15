import React, { useState } from "react";
import { 
  Calendar, 
  Search, 
  BookOpen, 
  User, 
  MessageSquare, 
  Clock, 
  MapPin, 
  Flame, 
  CheckCircle, 
  Send, 
  Sparkles, 
  Download, 
  AlertCircle,
  FileCheck2
} from "lucide-react";
import { DaySchedule, Homework, ChatMessage } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface StudentViewProps {
  schedule: DaySchedule[];
  homework: Homework[];
  setHomework: React.Dispatch<React.SetStateAction<Homework[]>>;
  studentGroup: string;
}

const DAYS_OF_WEEK = ["Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];

export default function StudentView({ schedule, homework, setHomework, studentGroup }: StudentViewProps) {
  const [selectedDay, setSelectedDay] = useState<string>("Dushanba");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"group" | "teacher" | "room">("group");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      content: "Assalomu alaykum! Men sizning AI dars jadvali yordamchingizman. Darslaringiz, topshiriqlaringiz yoki dars o'zgarishlari haqida so'rashingiz mumkin.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Student's personal schedule filtered by group and day
  const myGroupSchedule = schedule.filter(s => s.groupName === studentGroup);
  const myDaySchedule = myGroupSchedule.filter(s => s.dayOfWeek === selectedDay);

  // Filter homework for this students group
  const myHomework = homework.filter(h => h.groupId === "g1"); // Assuming student is in g1

  // Advanced search parameters for students to inspect other schedules
  const filteredSearch = schedule.filter(s => {
    if (!searchQuery) return false;
    const query = searchQuery.toLowerCase();
    if (searchType === "group") {
      return s.groupName.toLowerCase().includes(query);
    } else if (searchType === "teacher") {
      return s.teacherName.toLowerCase().includes(query);
    } else {
      return s.room.toLowerCase().includes(query);
    }
  });

  const handleToggleHomework = (id: string) => {
    setHomework(prev => prev.map(hw => {
      if (hw.id === id) {
        return { ...hw, status: hw.status === "completed" ? "pending" : "completed" };
      }
      return hw;
    }));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: userInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = userInput;
    setUserInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          scheduleContext: {
            talabaGuruhi: studentGroup,
            talabaDarslari: myGroupSchedule,
            barchaDarslar: schedule,
            uyVazifalari: myHomework
          },
          role: "student",
          additionalContext: {
            bugungiKun: selectedDay,
            hozirgiVaqt: new Date().toLocaleTimeString()
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.text) {
        setChatMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          content: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error(data.error || "Gemini-dan javob olishda xatolik yuz berdi");
      }
    } catch (error: any) {
      console.error(error);
      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        content: `Kechirasiz, sun'iy intellekt xizmati bilan bog'lanib bo'lmadi. (API key kiritilganiga yoki server ishlayotganiga ishonch hosil qiling). Tizim xatosi: ${error.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Dynamic Schedule & Day Selector */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Dars Jadvalingiz: {studentGroup}
              </h2>
              <p className="text-xs text-gray-400 mt-1">Haftalik mashg'ulotlaringiz rejalashtirilishi</p>
            </div>
            
            {/* Quick stats / widgets */}
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-2xl border border-emerald-100">
              <Flame className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-800">
                100% Davomat kuchi
              </span>
            </div>
          </div>

          {/* Horizontal Day Buttons */}
          <div className="flex overflow-x-auto gap-2 pb-3 scrollbar-hide">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDay === day;
              // Check if any lesson is present on this day
              const hasLessons = myGroupSchedule.some(s => s.dayOfWeek === day);
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2.5 rounded-2xl font-medium text-sm transition-all relative shrink-0 duration-200 ${
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

          {/* Lessons list */}
          <div className="mt-6 space-y-4">
            <AnimatePresence mode="popLayout">
              {myDaySchedule.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200"
                >
                  <Clock className="w-10 h-10 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium text-sm">{selectedDay} kuni darslar rejalashtirilmagan</p>
                  <p className="text-xs text-gray-400 mt-1">Ushbu kunni dam olish yoki mustaqil ta'limga bag'ishlang</p>
                </motion.div>
              ) : (
                myDaySchedule
                  .sort((a, b) => a.pairNumber - b.pairNumber)
                  .map((lesson) => (
                    <motion.div
                      key={lesson.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="group flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white hover:bg-slate-50/60 rounded-2xl border border-gray-100 transition-all duration-200 hover:border-emerald-100"
                    >
                      <div className="flex items-start gap-4">
                        {/* Pair Number Circle */}
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-all">
                          {lesson.pairNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900 text-sm md:text-base">{lesson.subject}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              lesson.type === "Ma'ruza"
                                ? "bg-blue-50 text-blue-700 border border-blue-100"
                                : lesson.type === "Amaliyot"
                                ? "bg-purple-50 text-purple-700 border border-purple-100"
                                : "bg-teal-50 text-teal-700 border border-teal-100"
                            }`}>
                              {lesson.type}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              {lesson.teacherName}
                            </span>
                            <span className="flex items-center gap-1 font-mono text-emerald-700">
                              <MapPin className="w-3.5 h-3.5" />
                              {lesson.room}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 md:mt-0 flex items-center gap-2 self-end md:self-center">
                        <div className="flex items-center gap-1.5 text-xs font-semibold bg-gray-50 text-gray-600 px-2.5 py-1 rounded-xl border border-gray-100">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {lesson.timeStart} - {lesson.timeEnd}
                        </div>
                      </div>
                    </motion.div>
                  ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Timetable Explorer */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-600" />
              Boshqa dars jadvallarini qidirish
            </h3>
            <p className="text-xs text-gray-400 mt-1">Istalgan guruh, o'qituvchi yoki ma'ruza xonalar jadvalini kuzating</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex rounded-xl bg-gray-50 p-1 border border-gray-200">
              {(["group", "teacher", "room"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    searchType === type 
                      ? "bg-white text-gray-900 shadow-xs border border-gray-100" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {type === "group" ? "Guruh" : type === "teacher" ? "O'qituvchi" : "Xona"}
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === "group" 
                    ? "Masalan: 941-21" 
                    : searchType === "teacher" 
                    ? "Masalan: Mardonov" 
                    : "Masalan: 205-хона"
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {searchQuery && (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredSearch.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400">Hech qanday dars topilmadi</div>
              ) : (
                filteredSearch.map((s, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center text-sm">
                    <div>
                      <div className="font-semibold text-gray-800">{s.subject}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {s.groupName} • {s.teacherName} • {s.room}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 block">{s.dayOfWeek}</span>
                      <span className="text-[10px] text-gray-400 block mt-1">{s.timeStart} ({s.pairNumber}-para)</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: AI Assistant & Homework checklist */}
      <div className="space-y-6">
        {/* Homework list */}
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                Vazifalar (Homework)
              </h3>
              <p className="text-xs text-gray-400">Sizning faol amaliy topshiriqlaringiz</p>
            </div>
          </div>

          <div className="space-y-3">
            {myHomework.map((hw) => {
              const isCompleted = hw.status === "completed";
              return (
                <div 
                  key={hw.id} 
                  className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                    isCompleted 
                      ? "bg-slate-50/55 border-slate-100 opacity-65" 
                      : "bg-white border-gray-100 hover:border-emerald-100 shadow-2xs"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <button 
                      onClick={() => handleToggleHomework(hw.id)}
                      className="mt-0.5 shrink-0 transition-transform active:scale-90"
                    >
                      <CheckCircle className={`w-5 h-5 ${isCompleted ? 'text-emerald-500 fill-emerald-100' : 'text-gray-300 hover:text-emerald-500'}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold text-gray-900 ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                        {hw.title}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1">{hw.description}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 flex-wrap gap-2 text-[10px]">
                        <span className="text-gray-500 truncate">{hw.subject}</span>
                        <span className={`px-2 py-0.5 rounded-lg font-semibold ${
                          new Date(hw.deadline) < new Date() ? 'bg-red-50 text-red-700' : 'bg-orange-50 text-orange-700'
                        }`}>
                          Muddati: {hw.deadline}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Aqlli AI Assistant Chat Box */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden flex flex-col h-[460px]">
          {/* Subtle sparkles ambient decoration */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-full filter blur-xl"></div>
          
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold tracking-tight">Aqlli Dars Jadvali AI</h4>
              <p className="text-[10px] text-emerald-400/80">Gemini 3.5-Flash tomonidan quvvatlangan</p>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-3 my-2 pr-1 text-xs scrollbar-hide">
            {chatMessages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  msg.sender === "user" 
                    ? "bg-emerald-600 text-white rounded-tr-none" 
                    : "bg-slate-800 text-slate-150 rounded-tl-none border border-slate-700/60"
                }`}>
                  {msg.content}
                </div>
                <span className="text-[9px] text-slate-400/80 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            
            {isTyping && (
              <div className="mr-auto bg-slate-800 border border-slate-700/60 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></span>
              </div>
            )}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="mt-2 flex gap-1.5 shrink-0">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Masalan: Ertaga 1-para bormi?"
              className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-400 placeholder:text-slate-500"
            />
            <button 
              type="submit" 
              className="p-2 bg-emerald-600 hover:bg-emerald-500 transition-colors rounded-xl text-white flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
