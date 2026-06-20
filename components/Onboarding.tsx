"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

// Overlay affiché au tout premier lancement (nom non défini) pour demander le prénom.
export default function Onboarding() {
  const setName = useStore((s) => s.setName);
  const [val, setVal] = useState("");

  const submit = () => {
    const v = val.trim();
    if (!v) return;
    setName(v);
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 20,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 24px",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 4 }}>👋</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.02em" }}>
        Bienvenue sur Cap
      </div>
      <div style={{ fontSize: 14, color: "var(--sub)", fontWeight: 500, marginTop: 6, lineHeight: 1.5 }}>
        Comment veux-tu qu&apos;on t&apos;appelle ?
      </div>

      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        autoFocus
        maxLength={24}
        placeholder="Ton prénom"
        style={{
          marginTop: 22,
          width: "100%",
          border: "1px solid var(--line)",
          background: "var(--card)",
          color: "var(--ink)",
          fontFamily: "inherit",
          fontSize: 16,
          fontWeight: 600,
          borderRadius: 14,
          padding: "14px 16px",
          outline: "none",
        }}
      />

      <button
        onClick={submit}
        className="press"
        style={{
          marginTop: 14,
          width: "100%",
          border: 0,
          background: "var(--acc)",
          color: "var(--accT)",
          fontFamily: "inherit",
          fontWeight: 800,
          fontSize: 15.5,
          borderRadius: 14,
          padding: 15,
          cursor: "pointer",
          opacity: val.trim() ? 1 : 0.42,
          transition: "opacity .15s",
        }}
      >
        Commencer
      </button>

      <div style={{ fontSize: 12, color: "var(--fai)", fontWeight: 500, marginTop: 14, lineHeight: 1.5 }}>
        Tes données restent sur cet appareil. Tu pourras changer ton nom dans Profil.
      </div>
    </div>
  );
}
