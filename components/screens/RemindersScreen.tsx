"use client";

import Icon from "../Icon";
import { useStore } from "@/store/useStore";
import { mainGoalOf } from "@/lib/selectors";
import { THEMES } from "@/lib/themes";
import { getPermission, requestPermission } from "@/lib/notify";

export default function RemindersScreen() {
  const s = useStore();
  const t = THEMES[s.theme];
  const mainGoal = mainGoalOf(s.goals);

  // Demande la permission notifs en activant un rappel (si pas encore accordée).
  const toggleWithPermission = async (k: "daily" | "income" | "weekly") => {
    const enabling = !s.reminders[k];
    s.toggleRem(k);
    if (enabling && getPermission() === "default") {
      await requestPermission();
    }
  };

  const toggleRow = (
    title: string,
    sub: string,
    on: boolean,
    onClick: () => void,
    border = true
  ) => (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 15px",
        borderBottom: border ? "1px solid var(--line)" : undefined,
        cursor: "pointer",
      }}
    >
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--ink)" }}>{title}</div>
        <div style={{ fontSize: 11.5, color: "var(--fai)", fontWeight: 500 }}>{sub}</div>
      </div>
      <div style={{ width: 44, height: 26, borderRadius: 999, position: "relative", flex: "0 0 auto", transition: "background .2s", background: on ? t.acc : t.line }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, transition: "left .2s", left: on ? 21 : 3 }} />
      </div>
    </div>
  );

  return (
    <div style={{ padding: "6px 18px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => s.go("home")} className="press" style={{ border: 0, background: "transparent", cursor: "pointer", color: "var(--ink)", display: "flex" }}>
          <Icon name="chevron-left" size={26} strokeWidth={2.2} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>Rappels &amp; coach</span>
        <span style={{ width: 26 }} />
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fai)", letterSpacing: ".04em", textTransform: "uppercase", margin: "0 2px -4px" }}>
        Aujourd&apos;hui
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: 14, display: "flex", gap: 12 }}>
        <span style={{ width: 38, height: 38, borderRadius: 11, background: "var(--streakBg)", color: "var(--streakC)", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
          <Icon name="flame" size={20} strokeWidth={2.2} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>Garde ta série de {s.streak} jours</div>
          <div style={{ fontSize: 12.5, color: "var(--sub)", fontWeight: 500, lineHeight: 1.4, marginTop: 2 }}>
            Note tes opérations du jour avant minuit.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
            <button onClick={s.openEntry} className="press" style={primaryBtn}>Saisir maintenant</button>
            <span style={{ fontSize: 11.5, color: "var(--fai)", fontWeight: 600 }}>20:00</span>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, padding: 14, display: "flex", gap: 12 }}>
        <span style={{ width: 38, height: 38, borderRadius: 11, background: "var(--incS)", color: "var(--inc)", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
          <Icon name="wallet" size={20} strokeWidth={2.2} />
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>Une entrée récente ?</div>
          <div style={{ fontSize: 12.5, color: "var(--sub)", fontWeight: 500, lineHeight: 1.4, marginTop: 2 }}>
            Alloue une part à « {mainGoal.name} » pendant que tu y penses.
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={() => s.openAlloc(mainGoal.id)} className="press" style={primaryBtn}>Allouer</button>
            <button onClick={() => s.go("home")} className="press" style={secondaryBtn}>Plus tard</button>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fai)", letterSpacing: ".04em", textTransform: "uppercase", margin: "4px 2px -4px" }}>
        Réglages
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
        {toggleRow("Rappel quotidien", "Tous les jours à 20:00", s.reminders.daily, () => toggleWithPermission("daily"))}
        {toggleRow("À chaque entrée d'argent", "Proposer d'allouer aux objectifs", s.reminders.income, () => toggleWithPermission("income"))}
        {toggleRow("Bilan hebdomadaire", "Dimanche soir", s.reminders.weekly, () => toggleWithPermission("weekly"), false)}
      </div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  border: 0,
  background: "var(--acc)",
  color: "var(--accT)",
  fontWeight: 700,
  fontSize: 12.5,
  fontFamily: "inherit",
  borderRadius: 9,
  padding: "7px 14px",
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  border: "1px solid var(--line)",
  background: "transparent",
  color: "var(--sub)",
  fontWeight: 700,
  fontSize: 12.5,
  fontFamily: "inherit",
  borderRadius: 9,
  padding: "7px 14px",
  cursor: "pointer",
};
