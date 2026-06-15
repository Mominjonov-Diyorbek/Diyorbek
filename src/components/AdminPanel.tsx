import React, { useState } from "react";
import { 
  Users, 
  UserPlus, 
  ShieldAlert, 
  BookOpen, 
  Layers, 
  Sliders, 
  MapPin, 
  Settings, 
  Trash2, 
  Plus, 
  FileCheck2, 
  Activity, 
  CheckCircle,
  Database
} from "lucide-react";
import { User, Teacher, Group, Room, SystemLog, Role } from "../types";
import { motion } from "motion/react";

interface AdminPanelProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  logs: SystemLog[];
  setLogs: React.Dispatch<React.SetStateAction<SystemLog[]>>;
}

export default function AdminPanel({
  users,
  setUsers,
  teachers,
  setTeachers,
  groups,
  setGroups,
  rooms,
  setRooms,
  logs,
  setLogs
}: AdminPanelProps) {
  const [adminTab, setAdminTab] = useState<"users" | "resources" | "logs">("users");

  // User form states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<Role>("student");
  const [userGroup, setUserGroup] = useState(groups[0]?.name || "");
  const [userDept, setUserDept] = useState("");

  // Resource form states - Group creator
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupFaculty, setNewGroupFaculty] = useState("");
  const [newGroupCount, setNewGroupCount] = useState(24);

  // Resource form states - Room creator
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomCapacity, setNewRoomCapacity] = useState(30);
  const [newRoomType, setNewRoomType] = useState<Room["type"]>("Kompyuter xonasi");

  const [message, setMessage] = useState("");

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) return;

    const newUser: User = {
      id: "u-" + Date.now(),
      name: userName,
      email: userEmail,
      role: userRole,
      group: userRole === "student" ? userGroup : undefined,
      department: userRole !== "student" ? userDept : undefined,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    };

    setUsers(prev => [...prev, newUser]);

    // If role is teacher, also upload to teachers list
    if (userRole === "teacher") {
      const newTeacherObj: Teacher = {
        id: newUser.id,
        name: userName,
        department: userDept || "Axborot Texnologiyalari",
        email: userEmail,
        phone: "+998 90 999-0000"
      };
      setTeachers(prev => [...prev, newTeacherObj]);
    }

    // Append Log
    const newLog: SystemLog = {
      id: "log-" + Date.now(),
      user: "Administrator",
      action: `Yangi foydalanuvchi qo'shildi: ${userName} (roli: ${userRole})`,
      time: new Date().toISOString().replace('T', ' ').substring(0, 16),
      role: "admin"
    };
    setLogs(prev => [newLog, ...prev]);

    // Reset Form
    setUserName("");
    setUserEmail("");
    setUserDept("");
    setMessage("Yangi foydalanuvchi muvaffaqiyatli ro'yxatga olindi!");
    setTimeout(() => setMessage(""), 3500);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Haqiqatan ham u foydalanuvchini o'chirmoqchisiz: ${name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      setTeachers(prev => prev.filter(t => t.id !== id));

      const newLog: SystemLog = {
        id: "log-" + Date.now(),
        user: "Administrator",
        action: `Foydalanuvchi o'chirildi: ${name}`,
        time: new Date().toISOString().replace('T', ' ').substring(0, 16),
        role: "admin"
      };
      setLogs(prev => [newLog, ...prev]);
    }
  };

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName || !newGroupFaculty) return;

    const newGroup: Group = {
      id: "g-" + Date.now(),
      name: newGroupName,
      faculty: newGroupFaculty,
      studentCount: Number(newGroupCount)
    };

    setGroups(prev => [...prev, newGroup]);
    
    // Log
    const newLog: SystemLog = {
      id: "log-" + Date.now(),
      user: "Administrator",
      action: `Yangi guruh yaratildi: ${newGroupName}`,
      time: new Date().toISOString().substring(0, 16),
      role: "admin"
    };
    setLogs(prev => [newLog, ...prev]);

    setNewGroupName("");
    setNewGroupFaculty("");
    setMessage("Yangi akademik guruh muvaffaqiyatli saqlandi!");
    setTimeout(() => setMessage(""), 3500);
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName) return;

    const newRoom: Room = {
      id: "r-" + Date.now(),
      name: newRoomName,
      capacity: Number(newRoomCapacity),
      type: newRoomType
    };

    setRooms(prev => [...prev, newRoom]);

    // Log
    const newLog: SystemLog = {
      id: "log-" + Date.now(),
      user: "Administrator",
      action: `Yangi auditoriya kiritildi: ${newRoomName}`,
      time: new Date().toISOString().substring(0, 16),
      role: "admin"
    };
    setLogs(prev => [newLog, ...prev]);

    setNewRoomName("");
    setMessage("Yangi auditoriya muvaffaqiyatli saqlandi!");
    setTimeout(() => setMessage(""), 3500);
  };

  return (
    <div className="space-y-6">
      {/* High-Level Statistics Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Jami Foydalanuvchilar</h4>
            <p className="text-xl font-bold text-gray-900 mt-1">{users.length} nafar</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Guruhlar Soni</h4>
            <p className="text-xl font-bold text-gray-900 mt-1">{groups.length} ta guruh</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Faol Auditoriyalar</h4>
            <p className="text-xl font-bold text-gray-900 mt-1">{rooms.length} ta xona</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-3xs flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Tizim holati</h4>
            <p className="text-xl font-bold text-emerald-600 mt-1 flex items-center gap-1">
              Active
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </p>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border-2 border-emerald-250 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
          {message}
        </div>
      )}

      {/* Admin Panel Subnavigation */}
      <div className="flex bg-gray-50 border border-gray-200 p-1.5 rounded-2xl w-fit">
        {(["users", "resources", "logs"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setAdminTab(tab)}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
              adminTab === tab 
                ? "bg-slate-900 text-white shadow-xs" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab === "users" ? "Foydalanuvchilar Boshqaruvi" : tab === "resources" ? "Tuzilmalar & Auditoriyalar" : "Xavfsizlik & Auditoriya Loglari"}
          </button>
        ))}
      </div>

      {adminTab === "users" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Add user form */}
          <div className="xl:col-span-1 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs h-fit space-y-4">
            <div>
              <h3 className="font-bold text-gray-950 text-sm flex items-center gap-1.5">
                <UserPlus className="w-4.5 h-4.5 text-emerald-600" />
                Yangi Foydalanuvchi Kiritish
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5 font-sans">Platformaga kirish huquqiga ega bo'ladigan rollarni sozlash</p>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">To'liq F.I.O.</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Masalan: G'ayrat Ergashev"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Elektron Pochta (Email)</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="name@university.uz"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Tizimdagi Roli (Role)</label>
                <div className="grid grid-cols-4 gap-1 p-1 bg-gray-50 border border-gray-250 rounded-xl">
                  {([
                    { val: "student", word: "Talaba" },
                    { val: "teacher", word: "Ustozi" },
                    { val: "staff", word: "Xodim" },
                    { val: "admin", word: "Admin" }
                  ] as const).map((r) => (
                    <button
                      key={r.val}
                      type="button"
                      onClick={() => setUserRole(r.val)}
                      className={`py-1.5 rounded-lg text-[9px] font-bold text-center transition-all ${
                        userRole === r.val 
                          ? "bg-white text-gray-950 shadow-2xs" 
                          : "text-gray-500 hover:text-gray-950"
                      }`}
                    >
                      {r.word}
                    </button>
                  ))}
                </div>
              </div>

              {userRole === "student" ? (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Akademik Guruhi</label>
                  <select
                    value={userGroup}
                    onChange={(e) => setUserGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Kafedra / Departament</label>
                  <input
                    type="text"
                    value={userDept}
                    onChange={(e) => setUserDept(e.target.value)}
                    placeholder="Masalan: Axborot Texnologiyalari kafedrasi"
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-555 transition-colors text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Yaratish va Saqlash
              </button>
            </form>
          </div>

          {/* Users List */}
          <div className="xl:col-span-2 bg-white rounded-3xl p-5 border border-gray-100 shadow-xs">
            <h3 className="font-bold text-gray-901 text-sm mb-4">Ro'yxatga olingan tarmoq a'zolari</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 uppercase tracking-wider text-[10px] rounded-lg">
                    <th className="py-2.5 px-3">To'liq ismi</th>
                    <th className="py-2.5 px-3">E-pochta manzili</th>
                    <th className="py-2.5 px-3">Roli</th>
                    <th className="py-2.5 px-3">Guruh/Bo'lim</th>
                    <th className="py-2.5 px-3 text-right">O'chirish</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 font-semibold text-gray-900 flex items-center gap-2">
                        <img src={u.avatar} alt="avatar" className="w-6.5 h-6.5 rounded-full object-cover border border-gray-200" />
                        {u.name}
                      </td>
                      <td className="py-2.5 px-3 text-gray-500 font-mono text-[11px]">{u.email}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase ${
                          u.role === "admin" 
                            ? "bg-red-50 text-red-700 border border-red-100" 
                            : u.role === "staff" 
                            ? "bg-purple-50 text-purple-700 border border-purple-100" 
                            : u.role === "teacher" 
                            ? "bg-blue-50 text-blue-700 border border-blue-100" 
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}>
                          {u.role === "admin" ? "Admin" : u.role === "staff" ? "Xodim" : u.role === "teacher" ? "Ustozi" : "Talaba"}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-gray-500">{u.group || u.department || "Markaziy ma'muriyat"}</td>
                      <td className="py-2.5 px-3 text-right">
                        {u.id !== "admin-1" ? (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="text-red-500 hover:text-red-750 p-1 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-300 italic">Asosiy</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {adminTab === "resources" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Groups cataloging */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-gray-950 text-sm flex items-center gap-1.5">
                <Layers className="w-4.5 h-4.5 text-emerald-600" />
                Yangi Akademik Guruh (Group) Yaratish
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Fakultetlar dars jadvali bog'lanadigan guruhlar jadvali</p>
            </div>

            <form onSubmit={handleAddGroup} className="space-y-3 text-xs bg-white">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Guruh nomi (Masalan: 941-21 AT)</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="941-21 AT"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Fakultet nomi</label>
                <input
                  type="text"
                  required
                  value={newGroupFaculty}
                  onChange={(e) => setNewGroupFaculty(e.target.value)}
                  placeholder="Kompyuter Injiniringi fakulteti"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-750 font-medium mb-1">Talabalar soni</label>
                <input
                  type="number"
                  required
                  value={newGroupCount}
                  onChange={(e) => setNewGroupCount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer hover:bg-emerald-555">
                Guruhni Saqlash
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 text-xs mb-2">Mavjud guruhlar ro'yxati vasiqasi</h4>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {groups.map(g => (
                  <div key={g.id} className="p-2.5 bg-gray-50 border border-gray-150 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-gray-800">{g.name}</p>
                      <p className="text-[10px] text-gray-450">{g.faculty}</p>
                    </div>
                    <span className="text-gray-550 font-mono text-[10px] block">{g.studentCount} ta talaba</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rooms / Classrooms cataloging */}
          <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-gray-950 text-sm flex items-center gap-1.5">
                <MapPin className="w-4.5 h-4.5 text-emerald-600" />
                Yangi Auditoriya / Xona Kiritish
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Mashg'ulotlar o'tkaziluvchi xonalar sig'imi va texnik jihozlanishi</p>
            </div>

            <form onSubmit={handleAddRoom} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Auditoriya Nomi (Masalan: 302-xona)</label>
                <input
                  type="text"
                  required
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="302-auditoriya"
                  className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Xona Sig'imi (O'rin)</label>
                  <input
                    type="number"
                    required
                    value={newRoomCapacity}
                    onChange={(e) => setNewRoomCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-gray-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">Xona Turi</label>
                  <select
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none text-xs"
                  >
                    <option value="Kompyuter xonasi">Kompyuter xonasi</option>
                    <option value="Ma'ruza xonasi">Ma'ruza xonasi</option>
                    <option value="Laboratoriya">Laboratoriya</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer hover:bg-emerald-555">
                Xonani Saqlash
              </button>
            </form>

            <div className="pt-4 border-t border-gray-100">
              <h4 className="font-bold text-gray-900 text-xs mb-2">Mavjud xonalar ro'yxati vasiqasi</h4>
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {rooms.map(r => (
                  <div key={r.id} className="p-2.5 bg-gray-50 border border-gray-150 rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-gray-800">{r.name}</p>
                      <p className="text-[10px] text-gray-450">{r.type}</p>
                    </div>
                    <span className="text-gray-550 font-mono text-[10px] block">{r.capacity} kishilik</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {adminTab === "logs" && (
        <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-950 text-sm flex items-center gap-1.5">
                <Activity className="w-4.5 h-4.5 text-red-500 animate-pulse" />
                Tizim Audit Log Kitobchasi (System Logs)
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Xodimlar va adminlar tomonidan amalga oshirilgan barcha o'zgarishlarning xavfsizlik registri</p>
            </div>
            
            <button 
              onClick={() => setLogs([])}
              className="text-[10px] font-bold text-red-650 hover:underline cursor-pointer"
            >
              Loglarni tozalash
            </button>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-xs font-sans">Hech qanday harakatlar qayd etilmagan</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-3 bg-gray-50 border border-gray-150 rounded-xl flex justify-between gap-4 items-start">
                  <div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-lg mr-2 uppercase ${
                      log.role === "admin" ? "bg-red-50 text-red-700" : "bg-purple-50 text-purple-700"
                    }`}>
                      {log.user}
                    </span>
                    <span className="text-slate-800 font-sans font-semibold">{log.action}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap">{log.time}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
