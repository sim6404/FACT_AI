"use client";

import { useState } from "react";
import {
  Shield, Users, Lock, Plus, Trash2, Edit3,
  CheckCircle2, XCircle, Key, Eye, EyeOff,
  AlertCircle, UserCheck,
} from "lucide-react";

type Role = "admin" | "manager" | "user" | "viewer";

interface UserEntry {
  id: number;
  name: string;
  email: string;
  dept: string;
  role: Role;
  active: boolean;
  lastLogin: string;
  mfa: boolean;
}

const INIT_USERS: UserEntry[] = [
  { id: 1, name: "김관리자", email: "admin@fourd.co.kr", dept: "정보시스템팀", role: "admin", active: true, lastLogin: "2026-03-14 14:25", mfa: true },
  { id: 2, name: "이생산부장", email: "lee.prod@fourd.co.kr", dept: "생산팀", role: "manager", active: true, lastLogin: "2026-03-14 09:11", mfa: true },
  { id: 3, name: "박품질팀장", email: "park.qa@fourd.co.kr", dept: "품질팀", role: "manager", active: true, lastLogin: "2026-03-14 08:47", mfa: false },
  { id: 4, name: "최영업담당", email: "choi.sales@fourd.co.kr", dept: "영업팀", role: "user", active: true, lastLogin: "2026-03-13 17:30", mfa: false },
  { id: 5, name: "정구매담당", email: "jung.purchase@fourd.co.kr", dept: "구매팀", role: "user", active: true, lastLogin: "2026-03-14 11:05", mfa: false },
  { id: 6, name: "한재무담당", email: "han.finance@fourd.co.kr", dept: "재무팀", role: "user", active: true, lastLogin: "2026-03-12 16:44", mfa: true },
  { id: 7, name: "오경영진", email: "oh.exec@fourd.co.kr", dept: "경영진", role: "viewer", active: true, lastLogin: "2026-03-14 10:00", mfa: true },
  { id: 8, name: "신창고담당", email: "shin.wh@fourd.co.kr", dept: "물류팀", role: "user", active: false, lastLogin: "2026-02-28 09:12", mfa: false },
];

const ROLE_META: Record<Role, { label: string; color: string; desc: string }> = {
  admin: { label: "관리자", color: "text-red-400 bg-red-400/10 border-red-400/30", desc: "전체 시스템 접근 및 설정 변경" },
  manager: { label: "매니저", color: "text-purple-400 bg-purple-400/10 border-purple-400/30", desc: "부서 데이터 조회 및 승인" },
  user: { label: "일반 사용자", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", desc: "담당 업무 데이터 조회/입력" },
  viewer: { label: "뷰어", color: "text-slate-400 bg-slate-400/10 border-slate-400/30", desc: "보고서 및 대시보드 조회만" },
};

const PERMISSIONS = [
  { module: "대시보드", admin: true, manager: true, user: true, viewer: true },
  { module: "AI 질의", admin: true, manager: true, user: true, viewer: false },
  { module: "보고서 생성", admin: true, manager: true, user: false, viewer: false },
  { module: "보고서 조회", admin: true, manager: true, user: true, viewer: true },
  { module: "승인함", admin: true, manager: true, user: true, viewer: false },
  { module: "문서 탐색", admin: true, manager: true, user: true, viewer: true },
  { module: "ERP 데이터 조회", admin: true, manager: true, user: true, viewer: true },
  { module: "ERP 데이터 입력", admin: true, manager: true, user: true, viewer: false },
  { module: "분석 대시보드", admin: true, manager: true, user: false, viewer: true },
  { module: "커넥터 관리", admin: true, manager: false, user: false, viewer: false },
  { module: "권한 정책", admin: true, manager: false, user: false, viewer: false },
  { module: "시스템 설정", admin: true, manager: false, user: false, viewer: false },
];

export default function SecurityPage() {
  const [users, setUsers] = useState<UserEntry[]>(INIT_USERS);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", dept: "", role: "user" as Role });
  const [activeTab, setActiveTab] = useState<"users" | "permissions">("users");

  function toggleActive(id: number) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  }

  function changeRole(id: number, role: Role) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  }

  function deleteUser(id: number) {
    setUsers(prev => prev.filter(u => u.id !== id));
  }

  function addUser() {
    if (!form.name || !form.email) return;
    setUsers(prev => [...prev, {
      id: Date.now(), name: form.name, email: form.email, dept: form.dept,
      role: form.role, active: true, lastLogin: "-", mfa: false,
    }]);
    setForm({ name: "", email: "", dept: "", role: "user" });
    setShowAdd(false);
  }

  const activeCount = users.filter(u => u.active).length;
  const mfaCount = users.filter(u => u.mfa).length;
  const adminCount = users.filter(u => u.role === "admin").length;

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">권한 정책</h1>
          <p className="text-slate-400 text-sm mt-1">사용자 계정 및 접근 권한 관리</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
        >
          <Plus size={14} /> 사용자 추가
        </button>
      </div>

      {/* 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "전체 사용자", value: users.length, icon: <Users size={18} className="text-blue-400" />, color: "text-blue-400" },
          { label: "활성 계정", value: activeCount, icon: <UserCheck size={18} className="text-green-400" />, color: "text-green-400" },
          { label: "관리자", value: adminCount, icon: <Shield size={18} className="text-red-400" />, color: "text-red-400" },
          { label: "MFA 적용", value: mfaCount, icon: <Key size={18} className="text-purple-400" />, color: "text-purple-400" },
        ].map((s) => (
          <div key={s.label} className="card rounded-xl p-4 flex items-center gap-3">
            {s.icon}
            <div>
              <p className="text-slate-400 text-xs">{s.label}</p>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}명</p>
            </div>
          </div>
        ))}
      </div>

      {/* 탭 */}
      <div className="flex gap-1 bg-slate-800 rounded-lg p-1 w-fit border border-slate-700">
        {[{ key: "users", label: "사용자 관리" }, { key: "permissions", label: "권한 매트릭스" }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-5 py-2 rounded text-sm font-medium transition-colors ${
              activeTab === tab.key ? "bg-amber-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 사용자 목록 */}
      {activeTab === "users" && (
        <div className="card rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">사용자</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">부서</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">역할</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">MFA</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">상태</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">마지막 로그인</th>
                <th className="text-center py-3 px-4 text-slate-400 font-medium">관리</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const rm = ROLE_META[u.role];
                return (
                  <tr key={u.id} className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-slate-200 font-medium">{u.name}</p>
                        <p className="text-slate-500 text-xs">{u.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{u.dept}</td>
                    <td className="py-3 px-4 text-center">
                      <select
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value as Role)}
                        className={`text-xs border rounded-full px-2 py-0.5 bg-transparent focus:outline-none cursor-pointer ${rm.color}`}
                      >
                        {(Object.keys(ROLE_META) as Role[]).map(r => (
                          <option key={r} value={r} className="bg-slate-800 text-white">{ROLE_META[r].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {u.mfa
                        ? <CheckCircle2 size={14} className="text-green-400 mx-auto" />
                        : <XCircle size={14} className="text-slate-600 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleActive(u.id)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${u.active ? "bg-amber-600" : "bg-slate-600"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${u.active ? "translate-x-5" : "translate-x-0.5"}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{u.lastLogin}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 권한 매트릭스 */}
      {activeTab === "permissions" && (
        <div className="card rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-700 bg-slate-800/50">
            <p className="text-sm text-slate-400">각 역할별 모듈 접근 권한을 확인합니다. 권한 변경은 관리자에게 문의하세요.</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">모듈</th>
                {(Object.keys(ROLE_META) as Role[]).map(r => (
                  <th key={r} className="text-center py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs border ${ROLE_META[r].color}`}>
                      {ROLE_META[r].label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p.module} className="border-b border-slate-800 hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 text-slate-300">{p.module}</td>
                  {(["admin", "manager", "user", "viewer"] as const).map(role => (
                    <td key={role} className="py-2.5 px-4 text-center">
                      {p[role]
                        ? <CheckCircle2 size={15} className="text-green-400 mx-auto" />
                        : <XCircle size={15} className="text-slate-700 mx-auto" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 역할 설명 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.entries(ROLE_META) as [Role, typeof ROLE_META[Role]][]).map(([role, meta]) => (
          <div key={role} className={`card rounded-xl p-3 border ${meta.color.split(" ")[2]}`}>
            <p className={`text-xs font-semibold mb-1 ${meta.color.split(" ")[0]}`}>{meta.label}</p>
            <p className="text-xs text-slate-400">{meta.desc}</p>
          </div>
        ))}
      </div>

      {/* 추가 모달 */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="card rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Plus size={18} className="text-amber-400" /> 사용자 추가
            </h2>
            <div className="space-y-4">
              {[
                { label: "이름", key: "name", ph: "홍길동" },
                { label: "이메일", key: "email", ph: "user@fourd.co.kr" },
                { label: "부서", key: "dept", ph: "생산팀" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm text-slate-400 mb-1">{f.label}</label>
                  <input
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    placeholder={f.ph}
                    value={(form as any)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm text-slate-400 mb-1">역할</label>
                <select
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value as Role }))}
                >
                  {(Object.keys(ROLE_META) as Role[]).map(r => (
                    <option key={r} value={r}>{ROLE_META[r].label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 border border-slate-700 text-slate-400 rounded-lg hover:bg-slate-800 text-sm">취소</button>
              <button onClick={addUser} className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium">추가</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
