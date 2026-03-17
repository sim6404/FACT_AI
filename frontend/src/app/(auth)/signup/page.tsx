"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Eye, EyeOff, Building2, UserPlus } from "lucide-react";

const DEPARTMENTS = [
  "경영지원팀", "생산팀", "품질팀", "영업팀",
  "구매팀", "물류팀", "IT팀", "재무팀",
];

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    department: "경영지원팀",
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      return;
    }
    setLoading(true);
    const res = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: "dept",
      department: form.department,
    });
    setLoading(false);
    if (res.ok) router.push("/dashboard");
    else setError(res.error ?? "회원가입에 실패했습니다.");
  }

  const inputStyle = {
    background: "#252525",
    border: "1px solid #383838",
  } as React.CSSProperties;

  function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "#D4920A";
  }
  function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = "#383838";
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >
      {/* 배경 광원 */}
      <div
        className="absolute top-1/4 right-1/3 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "#D4920A", opacity: 0.04, filter: "blur(100px)" }}
      />

      <div className="relative w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #D4920A, #b45309)" }}
          >
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">F.A.C.T. <span style={{ color: "#D4920A" }}>ERP</span></h1>
          <p className="text-sm mt-1" style={{ color: "#888" }}>AI 통합 플랫폼 회원가입</p>
        </div>

        {/* 카드 */}
        <div
          className="rounded-2xl p-8"
          style={{ background: "#1a1a1a", border: "1px solid #2e2e2e" }}
        >
          <h2 className="text-lg font-semibold text-white mb-5">회원가입</h2>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 이름 */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#aaa" }}>이름</label>
              <input
                required
                placeholder="홍길동"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                style={inputStyle}
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#aaa" }}>이메일</label>
              <input
                type="email"
                required
                placeholder="이메일 주소 입력"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                style={inputStyle}
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>

            {/* 부서 */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#aaa" }}>부서</label>
              <select
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none"
                style={inputStyle}
                value={form.department}
                onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                onFocus={focusBorder}
                onBlur={blurBorder}
              >
                {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#aaa" }}>비밀번호</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="6자 이상"
                  className="w-full px-3 py-2.5 pr-10 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                  style={inputStyle}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  onFocus={focusBorder}
                  onBlur={blurBorder}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#555" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#aaa")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#555")}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#aaa" }}>비밀번호 확인</label>
              <input
                type="password"
                required
                placeholder="비밀번호 재입력"
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-gray-600 outline-none"
                style={inputStyle}
                value={form.passwordConfirm}
                onChange={e => setForm(p => ({ ...p, passwordConfirm: e.target.value }))}
                onFocus={focusBorder}
                onBlur={blurBorder}
              />
            </div>

            {error && (
              <div
                className="text-xs px-3 py-2.5 rounded-lg"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-white transition-all mt-1 disabled:opacity-60"
              style={{ background: "#D4920A" }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = "#b45309")}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = "#D4920A")}
            >
              {loading ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" /> 가입하기
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center text-xs" style={{ color: "#666" }}>
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-medium transition-colors"
              style={{ color: "#D4920A" }}
            >
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
