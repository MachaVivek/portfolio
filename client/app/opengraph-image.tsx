import { ImageResponse } from "next/og";
import { portfolioData } from "@/data/portfolioData";

export const runtime = "nodejs";

export const alt = `${portfolioData.profile.name} — ${portfolioData.profile.title} | Portfolio`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const { profile } = portfolioData;

  const skills = [
    "React / Next.js",
    "Node.js / FastAPI",
    "AI & RAG",
    "Docker / AWS",
    "TypeScript",
    "PostgreSQL",
  ];

  const highlights = [
    "🏅 Institute Rank 3 — KMIT",
    "⚔️  LeetCode Knight (1900+)",
    "🧩 1000+ DSA Problems Solved",
    "📦 Open Source Contributor",
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #0f0f13 0%, #1a1025 50%, #0d1a2b 100%)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Top bar accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            background: "linear-gradient(to right, #8B5CF6, #22D3EE, #8B5CF6)",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            padding: "56px 64px 48px",
            gap: "52px",
            alignItems: "center",
          }}
        >
          {/* Left column — identity */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: "18px",
            }}
          >
            {/* Name badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "3px",
                  background: "linear-gradient(to right, #8B5CF6, #22D3EE)",
                  borderRadius: "2px",
                }}
              />
              <span
                style={{
                  fontSize: "15px",
                  color: "#a78bfa",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Portfolio
              </span>
            </div>

            <h1
              style={{
                fontSize: "62px",
                fontWeight: 800,
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.05,
                letterSpacing: "-1px",
              }}
            >
              {profile.name}
            </h1>

            <p
              style={{
                fontSize: "24px",
                color: "#a78bfa",
                margin: 0,
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              {profile.title}
            </p>

            <p
              style={{
                fontSize: "17px",
                color: "#94a3b8",
                margin: 0,
                lineHeight: 1.55,
                maxWidth: "460px",
              }}
            >
              Building scalable microservices, AI-powered products, and
              polished mobile/web experiences in Hyderabad, India.
            </p>

            {/* Highlights */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              {highlights.map((h) => (
                <span
                  key={h}
                  style={{
                    fontSize: "15px",
                    color: "#cbd5e1",
                    letterSpacing: "0.2px",
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — skills */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              minWidth: "280px",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                margin: 0,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Core Stack
            </p>
            {skills.map((skill) => (
              <div
                key={skill}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 20px",
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  borderRadius: "10px",
                  fontSize: "16px",
                  color: "#e2e8f0",
                  fontWeight: 500,
                }}
              >
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8B5CF6, #22D3EE)",
                    flexShrink: 0,
                  }}
                />
                {skill}
              </div>
            ))}

            {/* Domain tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginTop: "6px",
              }}
            >
              {["AI/RAG", "Full Stack", "DevOps", "Mobile"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "5px 14px",
                    background: "rgba(34,211,238,0.1)",
                    border: "1px solid rgba(34,211,238,0.25)",
                    borderRadius: "20px",
                    fontSize: "13px",
                    color: "#22D3EE",
                    fontWeight: 600,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 64px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span style={{ fontSize: "15px", color: "#475569" }}>
          machavivek.vercel.app
          </span>
          <span style={{ fontSize: "15px", color: "#475569" }}>
            machavivek19@gmail.com · Hyderabad, India
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
