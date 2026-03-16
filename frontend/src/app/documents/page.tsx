"use client";

import { useState, useRef, useCallback } from "react";
import {
  FolderOpen, Folder, FileText, File, Search,
  Download, Eye, Clock, User, Tag, Star, StarOff,
  Upload, X, Plus, Trash2, AlertCircle, CheckCircle2, FolderPlus,
} from "lucide-react";

type DocType = "PDF" | "XLSX" | "PPTX" | "DOCX" | "IMG" | "ETC";

interface DocFile {
  id: number; name: string; type: DocType; size: string;
  updated_at: string; updated_by: string; tags: string[];
  starred: boolean; folder: string;
}

const INIT_DOCS: DocFile[] = [
  { id:1,  name:"STRW DAMPER 도면 Rev.3",     type:"PDF",  size:"4.2MB",  updated_at:"2026-03-13", updated_by:"김설계", tags:["도면","SD-2341"],    starred:true,  folder:"도면/완제품" },
  { id:2,  name:"HORN PLATE 작업표준서",       type:"PDF",  size:"1.8MB",  updated_at:"2026-03-12", updated_by:"이생산", tags:["작업표준","HP-1122"],starred:true,  folder:"작업표준서" },
  { id:3,  name:"2026년 3월 품질 성적서",      type:"XLSX", size:"0.9MB",  updated_at:"2026-03-13", updated_by:"이품질", tags:["품질","성적서"],      starred:false, folder:"품질/성적서" },
  { id:4,  name:"현대자동차 납품 규격서 v2",   type:"PDF",  size:"6.1MB",  updated_at:"2026-03-10", updated_by:"김영업", tags:["현대","납품규격"],    starred:true,  folder:"고객사 규격서" },
  { id:5,  name:"ISO 9001 품질매뉴얼 2026",    type:"DOCX", size:"2.3MB",  updated_at:"2026-03-01", updated_by:"이품질", tags:["ISO","품질매뉴얼"],   starred:false, folder:"인증/ISO" },
  { id:6,  name:"4월 생산계획서",              type:"XLSX", size:"0.5MB",  updated_at:"2026-03-13", updated_by:"김생산", tags:["생산계획"],            starred:false, folder:"생산/계획" },
  { id:7,  name:"원자재 공급업체 평가표 Q1",   type:"XLSX", size:"1.1MB",  updated_at:"2026-03-08", updated_by:"박구매", tags:["구매","공급업체"],    starred:false, folder:"구매/평가" },
  { id:8,  name:"설비 예방정비 매뉴얼 A라인",  type:"PDF",  size:"8.4MB",  updated_at:"2026-03-05", updated_by:"최설비", tags:["설비","A라인"],        starred:false, folder:"설비/매뉴얼" },
  { id:9,  name:"2025년 연간 보고서",          type:"PPTX", size:"12.3MB", updated_at:"2026-02-28", updated_by:"김관리", tags:["연간보고서","경영"],   starred:true,  folder:"경영/보고서" },
  { id:10, name:"BUSH FRONT 재료 성분표",      type:"PDF",  size:"0.7MB",  updated_at:"2026-03-07", updated_by:"박품질", tags:["재료","BF-3310"],     starred:false, folder:"도면/완제품" },
  { id:11, name:"생산 OEE 분석 템플릿",        type:"XLSX", size:"0.4MB",  updated_at:"2026-03-11", updated_by:"이생산", tags:["OEE","템플릿"],        starred:false, folder:"생산/분석" },
  { id:12, name:"현장 안전수칙 포스터",        type:"IMG",  size:"3.2MB",  updated_at:"2026-02-15", updated_by:"한안전", tags:["안전","현장"],          starred:false, folder:"안전" },
];

const FOLDERS = ["전체","도면/완제품","작업표준서","품질/성적서","고객사 규격서","인증/ISO","생산/계획","구매/평가","설비/매뉴얼","경영/보고서","생산/분석","안전"];

const TYPE_CFG: Record<DocType, { color: string; bg: string; icon: React.ElementType }> = {
  PDF:  { color:"#f87171", bg:"rgba(239,68,68,0.15)",   icon: FileText },
  XLSX: { color:"#4ade80", bg:"rgba(74,222,128,0.15)",  icon: FileText },
  PPTX: { color:"#fb923c", bg:"rgba(251,146,60,0.15)",  icon: FileText },
  DOCX: { color:"#60a5fa", bg:"rgba(96,165,250,0.15)",  icon: FileText },
  IMG:  { color:"#c084fc", bg:"rgba(192,132,252,0.15)", icon: File },
  ETC:  { color:"#94a3b8", bg:"rgba(148,163,184,0.15)", icon: File },
};

function getExtType(filename: string): DocType {
  const ext = filename.split(".").pop()?.toUpperCase() ?? "";
  if (ext === "PDF") return "PDF";
  if (["XLS","XLSX","CSV"].includes(ext)) return "XLSX";
  if (["PPT","PPTX"].includes(ext)) return "PPTX";
  if (["DOC","DOCX"].includes(ext)) return "DOCX";
  if (["PNG","JPG","JPEG","GIF","SVG","WEBP"].includes(ext)) return "IMG";
  return "ETC";
}

function fmtBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + "KB";
  return (bytes / 1024 / 1024).toFixed(1) + "MB";
}

// ── Toast 컴포넌트 ───────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: "success" | "error" | "info"; onClose: () => void }) {
  const col = type === "success" ? "#4ade80" : type === "error" ? "#ef4444" : "#D4920A";
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-medium"
      style={{ background: "#1e1e1e", border: `1px solid ${col}50` }}
    >
      {type === "success"
        ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: col }} />
        : <AlertCircle  className="w-4 h-4 flex-shrink-0" style={{ color: col }} />}
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── 업로드 모달 ──────────────────────────────────────────────────
function UploadModal({ folder, folders, onClose, onUpload }: {
  folder: string;
  folders: string[];
  onClose: () => void;
  onUpload: (files: { name: string; type: DocType; size: string; folder: string; tags: string[] }[]) => void;
}) {
  const [files, setFiles]         = useState<File[]>([]);
  const [targetFolder, setTarget] = useState(folder === "전체" ? folders[1] : folder);
  const [tagInput, setTagInput]   = useState("");
  const [tags, setTags]           = useState<string[]>([]);
  const [dragging, setDragging]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
  }, []);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags(p => [...p, t]);
    setTagInput("");
  };

  const submit = async () => {
    if (!files.length) return;
    setUploading(true);
    for (let i = 10; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 80));
      setProgress(i);
    }
    onUpload(files.map(f => ({
      name: f.name,
      type: getExtType(f.name),
      size: fmtBytes(f.size),
      folder: targetFolder,
      tags,
    })));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 rounded-2xl w-full max-w-lg mx-4 shadow-2xl"
        style={{ background: "#1e1e1e", border: "1px solid #383838" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#2e2e2e" }}>
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Upload className="w-4 h-4" style={{ color: "#D4920A" }} />
            문서 업로드
          </div>
          <button onClick={onClose} style={{ color: "#666" }} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* 드래그앤드롭 영역 */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
            style={{
              borderColor: dragging ? "#D4920A" : "#383838",
              background: dragging ? "rgba(212,146,10,0.05)" : "rgba(0,0,0,0.2)",
            }}
          >
            <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: dragging ? "#D4920A" : "#555" }} />
            <p className="text-sm font-medium" style={{ color: dragging ? "#D4920A" : "#888" }}>
              파일을 드래그하거나 클릭하여 선택
            </p>
            <p className="text-xs mt-1" style={{ color: "#555" }}>
              PDF, XLSX, PPTX, DOCX, 이미지 등 모든 형식 지원
            </p>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              onChange={e => e.target.files && setFiles(p => [...p, ...Array.from(e.target.files!)])}
            />
          </div>

          {/* 선택된 파일 목록 */}
          {files.length > 0 && (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {files.map((f, i) => {
                const cfg = TYPE_CFG[getExtType(f.name)];
                const Icon = cfg.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "#252525" }}>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: cfg.bg }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{f.name}</div>
                      <div className="text-[10px]" style={{ color: "#666" }}>{fmtBytes(f.size)}</div>
                    </div>
                    <button
                      onClick={() => setFiles(p => p.filter((_, j) => j !== i))}
                      style={{ color: "#666" }}
                      className="hover:text-red-400 flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* 저장 폴더 선택 */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "#888" }}>저장 폴더</label>
            <select
              value={targetFolder}
              onChange={e => setTarget(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              style={{ background: "#141414", border: "1px solid #383838" }}
            >
              {folders.slice(1).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          {/* 태그 */}
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "#888" }}>태그 (선택)</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTag()}
                placeholder="태그 입력 후 Enter"
                className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none"
                style={{ background: "#141414", border: "1px solid #383838", color: "#e0e0e0" }}
              />
              <button
                onClick={addTag}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: "#D4920A" }}
              >
                추가
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map(t => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(212,146,10,0.15)", color: "#f59e0b", border: "1px solid rgba(212,146,10,0.3)" }}
                  >
                    {t}
                    <button onClick={() => setTags(p => p.filter(x => x !== t))}>
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 업로드 진행바 */}
          {uploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs" style={{ color: "#888" }}>
                <span>업로드 중...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: "#2a2a2a" }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%`, background: "#D4920A" }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 px-6 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm border"
            style={{ borderColor: "#383838", color: "#888" }}
          >
            취소
          </button>
          <button
            onClick={submit}
            disabled={!files.length || uploading}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: "#D4920A" }}
          >
            {uploading ? `업로드 중... ${progress}%` : `업로드 (${files.length}개)`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 미리보기 모달 ────────────────────────────────────────────────
function PreviewModal({ doc, onClose, onDelete }: {
  doc: DocFile;
  onClose: () => void;
  onDelete: (id: number) => void;
}) {
  const cfg = TYPE_CFG[doc.type] ?? TYPE_CFG.ETC;
  const Icon = cfg.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 rounded-2xl w-full max-w-lg mx-4 shadow-2xl"
        style={{ background: "#1e1e1e", border: "1px solid #383838" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#2e2e2e" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: cfg.bg }}
            >
              <Icon className="w-4 h-4" style={{ color: cfg.color }} />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">{doc.name}</div>
              <div className="text-[11px] mt-0.5" style={{ color: "#666" }}>{doc.folder}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: "#666" }} className="hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div
            className="rounded-xl flex flex-col items-center justify-center py-14 gap-3"
            style={{ background: "#141414", border: "1px solid #2e2e2e" }}
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: cfg.bg }}>
              <Icon className="w-7 h-7" style={{ color: cfg.color }} />
            </div>
            <div className="text-sm font-medium text-white text-center px-4">{doc.name}</div>
            <div className="text-xs" style={{ color: "#666" }}>{doc.type} · {doc.size}</div>
            <div
              className="text-xs px-3 py-1.5 rounded-lg"
              style={{ background: "#252525", color: "#666" }}
            >
              미리보기는 실제 파일 연동 후 지원됩니다
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["파일 형식", doc.type],
                ["파일 크기", doc.size],
                ["최종 수정", doc.updated_at],
                ["수정자",   doc.updated_by],
                ["저장 폴더", doc.folder],
              ] as [string, string][]
            ).map(([k, v]) => (
              <div key={k} className="rounded-lg px-3 py-2.5" style={{ background: "#141414" }}>
                <div className="text-[10px] mb-0.5" style={{ color: "#555" }}>{k}</div>
                <div className="text-xs font-medium text-white truncate">{v}</div>
              </div>
            ))}
          </div>

          {doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {doc.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
                  style={{ background: "#252525", color: "#777", border: "1px solid #383838" }}
                >
                  <Tag className="w-2.5 h-2.5" />{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 px-6 pb-5">
          <button
            onClick={() => { onDelete(doc.id); onClose(); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
            style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
          >
            <Trash2 className="w-3.5 h-3.5" /> 삭제
          </button>
          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = "#";
              a.download = doc.name;
              a.click();
            }}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "#D4920A" }}
          >
            <Download className="w-4 h-4" /> 다운로드
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────────
export default function DocumentsPage() {
  const [docs, setDocs]             = useState<DocFile[]>(INIT_DOCS);
  const [search, setSearch]         = useState("");
  const [folder, setFolder]         = useState("전체");
  const [starOnly, setStarOnly]     = useState(false);
  const [typeFilter, setTypeFilter] = useState<DocType | "전체">("전체");
  const [showUpload, setShowUpload] = useState(false);
  const [preview, setPreview]       = useState<DocFile | null>(null);
  const [toast, setToast]           = useState<{ msg: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = docs.filter(d => {
    const mF = folder === "전체" || d.folder === folder;
    const mS = !starOnly || d.starred;
    const mT = typeFilter === "전체" || d.type === typeFilter;
    const mQ = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.tags.some(t => t.includes(search));
    return mF && mS && mT && mQ;
  });

  const toggleStar = (id: number) =>
    setDocs(p => p.map(d => d.id === id ? { ...d, starred: !d.starred } : d));

  const handleDelete = (id: number) => {
    setDocs(p => p.filter(d => d.id !== id));
    showToast("문서가 삭제되었습니다.", "info");
  };

  const handleDownload = (doc: DocFile) => {
    const a = document.createElement("a");
    a.href = "#";
    a.download = doc.name;
    a.click();
    showToast(`${doc.name} 다운로드를 시작합니다.`, "success");
  };

  const handleUpload = (files: { name: string; type: DocType; size: string; folder: string; tags: string[] }[]) => {
    const today = new Date().toISOString().split("T")[0];
    setDocs(p => [
      ...files.map((f, i) => ({
        id: Date.now() + i,
        name: f.name,
        type: f.type,
        size: f.size,
        updated_at: today,
        updated_by: "김관리",
        tags: f.tags,
        starred: false,
        folder: f.folder,
      })),
      ...p,
    ]);
    showToast(`${files.length}개 파일이 업로드되었습니다.`, "success");
  };

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* ── 헤더 ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">문서 탐색기</h1>
          <p className="text-sm mt-1" style={{ color: "#888" }}>도면 · 작업표준 · 성적서 · 규격서 통합 관리</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition-all"
          style={{ background: "#D4920A" }}
        >
          <Upload className="w-4 h-4" /> 문서 업로드
        </button>
      </div>

      {/* ── KPI 카드 ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "전체 문서",    value: docs.length,                                           color: "#f0f0f0" },
          { label: "즐겨찾기",     value: docs.filter(d => d.starred).length,                    color: "#f59e0b" },
          { label: "PDF 문서",     value: docs.filter(d => d.type === "PDF").length,              color: "#f87171" },
          { label: "이번 주 등록", value: docs.filter(d => d.updated_at >= "2026-03-10").length,  color: "#4ade80" },
        ].map(k => (
          <div key={k.label} className="rounded-xl p-4" style={{ background: "#1e1e1e", border: "1px solid #2e2e2e" }}>
            <div className="text-[11px] mb-1" style={{ color: "#666" }}>{k.label}</div>
            <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-5">
        {/* ── 폴더 트리 ── */}
        <div className="w-52 flex-shrink-0">
          <div className="rounded-2xl p-3" style={{ background: "#1a1a1a", border: "1px solid #2e2e2e" }}>
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#555" }}>폴더</span>
              <button
                onClick={() => showToast("새 폴더 기능 준비 중입니다.", "info")}
                style={{ color: "#555" }}
                className="hover:text-white transition-colors"
              >
                <FolderPlus className="w-3.5 h-3.5" />
              </button>
            </div>
            {FOLDERS.map(f => {
              const count = f === "전체" ? docs.length : docs.filter(d => d.folder === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setFolder(f)}
                  className="w-full text-left flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors"
                  style={
                    folder === f
                      ? { background: "rgba(212,146,10,0.12)", color: "#f59e0b" }
                      : { color: "#777" }
                  }
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {f === "전체"
                      ? <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" />
                      : <Folder className="w-3.5 h-3.5 flex-shrink-0" />}
                    <span className="truncate">{f}</span>
                  </div>
                  <span
                    className="text-[10px] flex-shrink-0"
                    style={{ color: folder === f ? "#D4920A" : "#555" }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 파일 영역 ── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* 검색 / 필터 */}
          <div className="flex flex-wrap gap-2">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1 min-w-[200px]"
              style={{ background: "#1a1a1a", border: "1px solid #2e2e2e" }}
            >
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#555" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="문서명 · 태그 검색"
                className="bg-transparent text-sm focus:outline-none w-full"
                style={{ color: "#e0e0e0" }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ color: "#555" }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "#1a1a1a" }}>
              {(["전체","PDF","XLSX","PPTX","DOCX"] as (DocType | "전체")[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className="px-2.5 py-1 rounded-lg text-xs transition-colors"
                  style={typeFilter === t ? { background: "#D4920A", color: "#fff" } : { color: "#777" }}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStarOnly(!starOnly)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs border transition-colors"
              style={
                starOnly
                  ? { background: "rgba(245,158,11,0.15)", color: "#f59e0b", borderColor: "rgba(245,158,11,0.3)" }
                  : { color: "#777", borderColor: "#2e2e2e" }
              }
            >
              <Star className="w-3.5 h-3.5" /> 즐겨찾기만
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs px-1" style={{ color: "#666" }}>
            <span>{filtered.length}개 문서</span>
            {search && <span style={{ color: "#D4920A" }}>&ldquo;{search}&rdquo; 검색 결과</span>}
          </div>

          {/* 파일 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map(doc => {
              const cfg = TYPE_CFG[doc.type] ?? TYPE_CFG.ETC;
              const Icon = cfg.icon;
              return (
                <div
                  key={doc.id}
                  onClick={() => setPreview(doc)}
                  className="rounded-2xl p-4 cursor-pointer transition-all group"
                  style={{ background: "#1a1a1a", border: "1px solid #2e2e2e" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#484848")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#2e2e2e")}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: cfg.bg }}
                    >
                      <Icon className="w-5 h-5" style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-sm font-medium text-white leading-snug line-clamp-2">{doc.name}</span>
                        <button
                          onClick={e => { e.stopPropagation(); toggleStar(doc.id); }}
                          className="flex-shrink-0 transition-colors"
                          style={{ color: doc.starred ? "#f59e0b" : "#555" }}
                        >
                          {doc.starred
                            ? <Star className="w-3.5 h-3.5 fill-current" />
                            : <StarOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px]" style={{ color: "#666" }}>
                        <span className="font-semibold" style={{ color: cfg.color }}>{doc.type}</span>
                        <span>{doc.size}</span>
                      </div>
                    </div>
                  </div>

                  {doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {doc.tags.map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"
                          style={{ background: "#252525", color: "#666" }}
                        >
                          <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between mt-3 pt-2.5"
                    style={{ borderTop: "1px solid #252525" }}
                  >
                    <div className="text-[10px] flex items-center gap-2" style={{ color: "#666" }}>
                      <Clock className="w-3 h-3" />{doc.updated_at}
                      <User className="w-3 h-3 ml-1" />{doc.updated_by}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => { e.stopPropagation(); setPreview(doc); }}
                        style={{ color: "#555" }}
                        className="p-1 rounded hover:text-blue-400"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDownload(doc); }}
                        style={{ color: "#555" }}
                        className="p-1 rounded hover:text-amber-400"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); handleDelete(doc.id); }}
                        style={{ color: "#555" }}
                        className="p-1 rounded hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 업로드 유도 카드 */}
            <button
              onClick={() => setShowUpload(true)}
              className="rounded-2xl p-4 border-2 border-dashed flex flex-col items-center justify-center gap-2 min-h-[160px] transition-all"
              style={{ borderColor: "#2e2e2e", color: "#555" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#D4920A";
                (e.currentTarget as HTMLButtonElement).style.color = "#D4920A";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#2e2e2e";
                (e.currentTarget as HTMLButtonElement).style.color = "#555";
              }}
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs font-medium">문서 업로드</span>
            </button>

            {filtered.length === 0 && (
              <div className="col-span-3 py-16 text-center text-sm" style={{ color: "#555" }}>
                조건에 맞는 문서가 없습니다
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 모달 & 토스트 ── */}
      {showUpload && (
        <UploadModal
          folder={folder}
          folders={FOLDERS}
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}
      {preview && (
        <PreviewModal
          doc={preview}
          onClose={() => setPreview(null)}
          onDelete={handleDelete}
        />
      )}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
