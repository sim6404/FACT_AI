import { MarketingNav } from "@/components/marketing/MarketingNav";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function BlogPage() {
  const posts = [
    { title: "AI 에이전트가 제조 업계를 바꾸는 방법", date: "2026-03-10", tag: "AI 트렌드" },
    { title: "PPM 30% 줄이는 품질 AI 자동화 전략", date: "2026-03-03", tag: "품질관리" },
    { title: "주간 보고서 자동화로 8시간을 되찾은 기업들", date: "2026-02-24", tag: "생산성" },
    { title: "제조 데이터 사일로를 깨는 통합 플랫폼 구축법", date: "2026-02-17", tag: "데이터 전략" },
    { title: "5G 시대의 통신사 AI 혁신 사례", date: "2026-02-10", tag: "통신" },
    { title: "금융 컴플라이언스 보고 자동화의 현재와 미래", date: "2026-02-03", tag: "금융서비스" },
  ];

  return (
    <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", fontFamily: "'Pretendard', 'Noto Sans KR', -apple-system, sans-serif" }}>
      <MarketingNav />
      <section style={{ paddingTop: "130px", paddingBottom: "80px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.25)", borderRadius: "100px", padding: "6px 16px", marginBottom: "24px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#D4920A" }}>BLOG</span>
          </div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, marginBottom: "48px", letterSpacing: "-0.02em" }}>블로그</h1>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
            {posts.map((post) => (
              <div key={post.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "28px" }}>
                <div style={{ display: "inline-flex", background: "rgba(212,146,10,0.1)", border: "1px solid rgba(212,146,10,0.2)", borderRadius: "100px", padding: "3px 12px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#D4920A" }}>{post.tag}</span>
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#fff", lineHeight: 1.5, marginBottom: "12px" }}>{post.title}</h3>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{post.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
