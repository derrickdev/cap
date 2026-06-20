"use client";

import Icon from "./Icon";
import { useStore } from "@/store/useStore";

export default function BottomNav() {
  const screen = useStore((s) => s.screen);
  const go = useStore((s) => s.go);
  const openEntry = useStore((s) => s.openEntry);

  const opsActive = screen === "ops";
  const navC = (scr: string, active = screen === scr) =>
    active ? "var(--ink)" : "var(--fai)";
  const navW = (scr: string, active = screen === scr) => (active ? 2.4 : 2);
  const navFW = (scr: string, active = screen === scr) => (active ? 700 : 600);

  const item = (
    scr: "home" | "goals" | "profile" | "ops",
    icon: string,
    label: string,
    onClick: () => void
  ) => {
    const active = scr === "ops" ? opsActive : screen === scr;
    return (
      <button
        onClick={onClick}
        className="press"
        style={{
          border: 0,
          background: "transparent",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          color: navC(scr, active),
        }}
      >
        <Icon name={icon} size={22} strokeWidth={navW(scr, active)} />
        <span style={{ fontSize: 10, fontWeight: navFW(scr, active) }}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "11px 28px calc(20px + env(safe-area-inset-bottom))",
        background: "var(--nav)",
        borderTop: "1px solid var(--navL)",
        flex: "0 0 auto",
        zIndex: 5,
      }}
    >
      {item("home", "home", "Accueil", () => go("home"))}
      {item("goals", "target", "Objectifs", () => go("goals"))}
      <button
        onClick={openEntry}
        className="press"
        style={{
          border: 0,
          cursor: "pointer",
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "var(--acc)",
          color: "var(--accT)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 18px -4px var(--fabShadow)",
          marginTop: -30,
        }}
      >
        <Icon name="plus" size={28} strokeWidth={2.6} />
      </button>
      {item("ops", "receipt-text", "Opérations", () => go("ops"))}
      {item("profile", "user", "Profil", () => go("profile"))}
    </div>
  );
}
