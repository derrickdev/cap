"use client";

export default function StatusBar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 28px 6px",
        color: "var(--ink)",
        flex: "0 0 auto",
        zIndex: 5,
      }}
    >
      <span
        className="tab"
        style={{ fontWeight: 700, fontSize: 15 }}
      >
        9:41
      </span>
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        <svg width="19" height="12" viewBox="0 0 19 12" fill="currentColor">
          <rect x="0" y="7" width="3" height="5" rx="1" />
          <rect x="5" y="4.5" width="3" height="7.5" rx="1" />
          <rect x="10" y="2.2" width="3" height="9.8" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg
          width="17"
          height="12"
          viewBox="0 0 24 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        >
          <path d="M2 7a15 15 0 0 1 20 0" />
          <path d="M5.5 10.5a10 10 0 0 1 13 0" />
          <path d="M9 14a5 5 0 0 1 6 0" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="currentColor" strokeOpacity=".4" />
          <rect x="2" y="2" width="16.5" height="8" rx="1.5" fill="currentColor" />
          <rect x="22.6" y="4" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
