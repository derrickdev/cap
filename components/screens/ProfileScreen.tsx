"use client";

import Icon from "../Icon";
import { useStore } from "@/store/useStore";
import { THEMES } from "@/lib/themes";
import { CURRENCIES, curSuffix } from "@/lib/currency";
import { initials } from "@/lib/format";
import { exportReport } from "@/lib/pdf";

export default function ProfileScreen() {
  const s = useStore();
  const t = THEMES[s.theme];

  const renameUser = () => {
    let v: string | null = null;
    try {
      v = window.prompt("Ton nom ?", s.name);
    } catch {}
    if (v && v.trim()) s.setName(v);
  };

  const exportPdf = async () => {
    try {
      await exportReport({
        balance: s.balance,
        streak: s.streak,
        currency: s.currency,
        transactions: s.transactions,
        goals: s.goals,
      });
      s.showToast("Rapport PDF exporté", "file-text");
    } catch {
      s.showToast("Échec de l'export PDF", "x");
    }
  };

  const curTab = (active: boolean): React.CSSProperties =>
    active
      ? { color: t.ink, background: t.card, boxShadow: "0 1px 2px rgba(0,0,0,.06)" }
      : { color: t.mut };

  const lightTabStyle: React.CSSProperties =
    s.theme === "light"
      ? { color: t.ink, background: t.card, boxShadow: "0 1px 2px rgba(0,0,0,.06)" }
      : { color: t.mut };
  const darkTabStyle: React.CSSProperties =
    s.theme === "dark" ? { color: t.ink, background: t.card } : { color: t.mut };

  return (
    <div style={{ padding: "6px 18px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div onClick={renameUser} className="press" style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6, cursor: "pointer" }}>
        <div style={{ width: 54, height: 54, borderRadius: "50%", background: "var(--acc)", color: "var(--accT)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18 }}>
          {initials(s.name)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 19, fontWeight: 800, color: "var(--ink)" }}>{s.name || "Toi"}</span>
            <span style={{ color: "var(--fai)", display: "flex" }}>
              <Icon name="pencil-line" size={15} strokeWidth={2} />
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--fai)", fontWeight: 500 }}>Compte personnel · {curSuffix(s.currency)}</div>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 15px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ color: "var(--ink)", display: "flex" }}>
              <Icon name="moon" size={19} strokeWidth={2} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Apparence</span>
          </div>
          <div style={{ display: "flex", background: "var(--chip)", border: "1px solid var(--line)", borderRadius: 9, padding: 3 }}>
            <span onClick={() => s.setTheme("light")} style={{ fontSize: 12, fontWeight: 700, padding: "6px 11px", borderRadius: 7, cursor: "pointer", ...lightTabStyle }}>Clair</span>
            <span onClick={() => s.setTheme("dark")} style={{ fontSize: 12, fontWeight: 700, padding: "6px 11px", borderRadius: 7, cursor: "pointer", ...darkTabStyle }}>Sombre</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 15px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ color: "var(--ink)", display: "flex" }}>
              <Icon name="coins" size={19} strokeWidth={2} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Devise</span>
          </div>
          <div style={{ display: "flex", background: "var(--chip)", border: "1px solid var(--line)", borderRadius: 9, padding: 3 }}>
            {CURRENCIES.map((c) => (
              <span
                key={c.code}
                onClick={() => s.setCurrency(c.code)}
                style={{ fontSize: 12, fontWeight: 700, padding: "6px 10px", borderRadius: 7, cursor: "pointer", ...curTab(s.currency === c.code) }}
              >
                {c.code}
              </span>
            ))}
          </div>
        </div>
        <div onClick={() => s.go("reminders")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 15px", borderBottom: "1px solid var(--line)", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ color: "var(--ink)", display: "flex" }}>
              <Icon name="bell" size={19} strokeWidth={2} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Rappels &amp; coach</span>
          </div>
          <span style={{ color: "var(--fai)", display: "flex" }}>
            <Icon name="chevron-right" size={18} strokeWidth={2} />
          </span>
        </div>
        <div onClick={exportPdf} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 15px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ color: "var(--ink)", display: "flex" }}>
              <Icon name="file-text" size={19} strokeWidth={2} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Export rapport PDF</span>
          </div>
          <span style={{ color: "var(--fai)", display: "flex" }}>
            <Icon name="download" size={18} strokeWidth={2} />
          </span>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 15px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span style={{ color: "var(--ink)", display: "flex" }}>
              <Icon name="cloud" size={19} strokeWidth={2} />
            </span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Synchro web</span>
          </div>
          <span style={badge}>Bientôt</span>
        </div>
        <button onClick={s.reset} className="press" style={{ width: "100%", textAlign: "left", border: 0, borderBottom: "1px solid var(--line)", background: "transparent", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 11, padding: "14px 15px", cursor: "pointer" }}>
          <span style={{ color: "var(--ink)", display: "flex" }}>
            <Icon name="rotate-ccw" size={19} strokeWidth={2} />
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}>Remettre les données démo</span>
        </button>
        <button onClick={s.clearAll} className="press" style={{ width: "100%", textAlign: "left", border: 0, background: "transparent", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 11, padding: "14px 15px", cursor: "pointer" }}>
          <span style={{ color: "var(--exp)", display: "flex" }}>
            <Icon name="trash-2" size={19} strokeWidth={2} />
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--exp)" }}>Tout vider (repartir à zéro)</span>
        </button>
      </div>

      <div style={{ textAlign: "center", fontSize: 12, color: "var(--fai)", fontWeight: 500, marginTop: 4 }}>
        Cap · prototype v1 · données locales
      </div>
    </div>
  );
}

const badge: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "var(--fai)",
  background: "var(--chip)",
  border: "1px solid var(--line)",
  borderRadius: 999,
  padding: "4px 9px",
};
