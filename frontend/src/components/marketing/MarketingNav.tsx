"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "플랫폼", href: "/platform" },
    { label: "솔루션", href: "/solutions" },
    { label: "고객사례", href: "/cases" },
    { label: "가격", href: "/pricing" },
    { label: "회사소개", href: "/about" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(212,146,10,0.15)"
          : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm"
            style={{
              background: "linear-gradient(135deg, #D4920A, #f59e0b)",
              color: "#0a0a0a",
            }}
          >
            F
          </div>
          <span className="font-black text-white text-lg tracking-tight">
            F.A.C.T{" "}
            <span
              style={{
                color: "#D4920A",
                fontSize: "0.8em",
                fontWeight: 900,
                letterSpacing: "0.05em",
              }}
            >
              AI
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm rounded-lg transition-colors"
              style={{ color: "rgba(255,255,255,0.75)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="px-4 py-2 text-sm rounded-lg transition-all"
            style={{
              color: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#D4920A";
              e.currentTarget.style.color = "#D4920A";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "rgba(255,255,255,0.7)";
            }}
          >
            문의하기
          </Link>
          <Link
            href="/start"
            className="px-4 py-2 text-sm rounded-lg transition-all font-semibold"
            style={{ background: "#D4920A", color: "#0a0a0a" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "#f59e0b")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#D4920A")
            }
          >
            무료 시작
          </Link>
          <Link
            href="/login"
            className="px-3 py-2 text-sm transition-all"
            style={{ color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
            }
          >
            로그인
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileOpen((p) => !p)}
          aria-label="메뉴 열기"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-2"
          style={{
            background: "rgba(10,10,10,0.98)",
            borderBottom: "1px solid rgba(212,146,10,0.2)",
          }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-3 text-sm border-b"
              style={{
                color: "rgba(255,255,255,0.8)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 mt-3">
            <Link
              href="/contact"
              className="flex-1 py-2.5 text-sm text-center rounded-lg"
              style={{
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
              }}
              onClick={() => setMobileOpen(false)}
            >
              문의하기
            </Link>
            <Link
              href="/start"
              className="flex-1 py-2.5 text-sm text-center rounded-lg font-semibold"
              style={{ background: "#D4920A", color: "#0a0a0a" }}
              onClick={() => setMobileOpen(false)}
            >
              무료 시작
            </Link>
          </div>
          <Link
            href="/login"
            className="py-2 text-sm text-center"
            style={{ color: "rgba(255,255,255,0.45)" }}
            onClick={() => setMobileOpen(false)}
          >
            로그인
          </Link>
        </div>
      )}
    </nav>
  );
}
