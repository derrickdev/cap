"use client";

import Icon from "../Icon";
import RingProgress from "../RingProgress";
import { useStore } from "@/store/useStore";
import {
  monthTotals,
  goalTotals,
  mainGoalOf,
  pct,
  txToView,
} from "@/lib/selectors";
import { fmtAmt, shortAmt, curSuffix } from "@/lib/currency";

export default function HomeScreen() {
  const s = useStore();
  const cur = s.currency;
  const { monthIn, monthOut, net } = monthTotals(s.transactions);
  const { totalSaved } = goalTotals(s.goals);
  const mainGoal = mainGoalOf(s.goals);
  const mpct = mainGoal ? pct(mainGoal.saved, mainGoal.target) : 0;
  const recent = s.transactions.slice(0, 3).map((x) => txToView(s.theme, x, cur));
  const netLabel = (net >= 0 ? "+" : "−") + shortAmt(Math.abs(net), cur);

  return (
    <div
      style={{
        padding: "6px 18px 26px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, color: "var(--mut)", fontWeight: 500 }}>
            Bonsoir,
          </div>
          <div
            style={{
              fontSize: 21,
              fontWeight: 800,
              color: "var(--ink)",
              letterSpacing: "-.02em",
            }}
          >
            Awa
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <button
            onClick={s.toggleTheme}
            className="press"
            style={circleBtn}
          >
            <Icon name={s.theme === "light" ? "moon" : "sun"} size={18} strokeWidth={2} />
          </button>
          <button
            onClick={() => s.go("reminders")}
            className="press"
            style={{ ...circleBtn, position: "relative" }}
          >
            <Icon name="bell" size={18} strokeWidth={2} />
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 9,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--exp)",
              }}
            />
          </button>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: "var(--streakBg)",
              color: "var(--streakC)",
              borderRadius: 999,
              padding: "7px 11px 7px 9px",
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            <Icon name="flame" size={16} strokeWidth={2.2} />
            <span className="tab">{s.streak}</span>
          </div>
        </div>
      </div>

      {/* HERO solde */}
      <div style={{ background: "var(--hero)", borderRadius: 24, padding: 20, color: "var(--heroT)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#A1A1AA", fontWeight: 500 }}>Solde total</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              background: "var(--heroPill)",
              color: "var(--acc)",
              fontWeight: 700,
              fontSize: 12,
              borderRadius: 999,
              padding: "4px 9px",
            }}
          >
            <Icon name="arrow-up-right" size={13} strokeWidth={2.6} />
            {netLabel}
          </span>
        </div>
        <div style={{ margin: "8px 0 2px", fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1 }}>
          <span className="tab" style={{ fontSize: 36 }}>{fmtAmt(s.balance, cur)}</span>{" "}
          <span style={{ fontSize: 16, color: "#A1A1AA", fontWeight: 700 }}>{curSuffix(cur)}</span>
        </div>
        <div style={{ fontSize: 12.5, color: "#71717A", fontWeight: 500 }}>
          Épargné dans tes objectifs ·{" "}
          <span className="tab" style={{ color: "#D4D4D8", fontWeight: 700 }}>
            {fmtAmt(totalSaved, cur)} {curSuffix(cur)}
          </span>
        </div>
      </div>

      {/* Entrées / Sorties */}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={miniCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <span style={{ ...miniIcon, background: "var(--incS)", color: "var(--inc)" }}>
              <Icon name="arrow-down-left" size={15} strokeWidth={2.4} />
            </span>
            <span style={{ fontSize: 12, color: "var(--mut)", fontWeight: 600 }}>Entrées · juin</span>
          </div>
          <div className="tab" style={{ fontSize: 17, fontWeight: 800, color: "var(--inc)", letterSpacing: "-.02em" }}>
            +{fmtAmt(monthIn, cur)}
          </div>
        </div>
        <div style={miniCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <span style={{ ...miniIcon, background: "var(--expS)", color: "var(--exp)" }}>
              <Icon name="arrow-up-right" size={15} strokeWidth={2.4} />
            </span>
            <span style={{ fontSize: 12, color: "var(--mut)", fontWeight: 600 }}>Sorties · juin</span>
          </div>
          <div className="tab" style={{ fontSize: 17, fontWeight: 800, color: "var(--exp)", letterSpacing: "-.02em" }}>
            −{fmtAmt(monthOut, cur)}
          </div>
        </div>
      </div>

      {/* Objectif principal */}
      {mainGoal ? (
      <button
        onClick={() => s.selectGoal(mainGoal.id)}
        className="press"
        style={{
          textAlign: "left",
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: 20,
          padding: 16,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--fai)", letterSpacing: ".06em", textTransform: "uppercase" }}>
            Objectif principal
          </span>
          <span style={{ color: "var(--fai)", display: "flex" }}>
            <Icon name="chevron-right" size={18} strokeWidth={2} />
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <RingProgress pct={mpct} size={66} innerSize={50}>
            <span className="tab" style={{ fontWeight: 800, fontSize: 15, color: "var(--ink)" }}>
              {mpct}%
            </span>
          </RingProgress>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.02em" }}>
              {mainGoal.name}
            </div>
            <div className="tab" style={{ fontSize: 13, color: "var(--sub)", fontWeight: 600, marginTop: 1 }}>
              {fmtAmt(mainGoal.saved, cur)}{" "}
              <span style={{ color: "var(--fai)", fontWeight: 500 }}>/ {fmtAmt(mainGoal.target, cur)} {curSuffix(cur)}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--fai)", fontWeight: 500, marginTop: 3 }}>
              Échéance {mainGoal.deadline}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--accS)",
            borderRadius: 13,
            padding: "11px 13px",
            marginTop: 14,
          }}
        >
          <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.4, color: "var(--accI)", fontWeight: 600 }}>
            Alloue <span className="tab" style={{ fontWeight: 800 }}>{fmtAmt(mainGoal.monthly, cur)} {curSuffix(cur)}</span> en juin pour rester dans les temps.
          </div>
          <span
            onClick={(e) => {
              e.stopPropagation();
              s.openAlloc(mainGoal.id);
            }}
            style={{
              background: "var(--acc)",
              color: "var(--accT)",
              fontWeight: 700,
              fontSize: 13,
              borderRadius: 10,
              padding: "9px 14px",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            Allouer
          </span>
        </div>
      </button>
      ) : (
        <button
          onClick={() => s.addGoal()}
          className="press"
          style={{
            textAlign: "left",
            background: "var(--card)",
            border: "1px dashed var(--line)",
            borderRadius: 20,
            padding: 16,
            cursor: "pointer",
            fontFamily: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "var(--sub)",
          }}
        >
          <span style={{ width: 40, height: 40, borderRadius: 12, background: "var(--accS)", color: "var(--acc)", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
            <Icon name="plus" size={22} strokeWidth={2.4} />
          </span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>Crée ton premier objectif</div>
            <div style={{ fontSize: 12.5, color: "var(--fai)", fontWeight: 500, marginTop: 1 }}>Voiture, voyage, fonds d&apos;urgence…</div>
          </div>
        </button>
      )}

      {/* Récent */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 2px 8px" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>Récent</span>
          <span onClick={() => s.go("ops")} style={{ fontSize: 12.5, fontWeight: 600, color: "var(--acc)", cursor: "pointer" }}>
            Tout voir
          </span>
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
          {recent.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 11,
                  background: tx.chipBg,
                  color: tx.chipColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: "0 0 auto",
                }}
              >
                <Icon name={tx.icon} size={18} strokeWidth={2} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {tx.label}
                </div>
                <div style={{ fontSize: 12, color: "var(--fai)", fontWeight: 500 }}>
                  {tx.catLabel} · {tx.time}
                </div>
              </div>
              <span className="tab" style={{ fontSize: 14, fontWeight: 800, color: tx.amtColor }}>
                {tx.amtFmt}
              </span>
            </div>
          ))}
          {recent.length === 0 && (
            <div style={{ padding: "16px 14px", textAlign: "center", fontSize: 12.5, color: "var(--fai)", fontWeight: 500 }}>
              Aucune opération. Tape « + » pour en ajouter une.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const circleBtn: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  border: "1px solid var(--line)",
  background: "var(--card)",
  color: "var(--ink)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const miniCard: React.CSSProperties = {
  flex: 1,
  background: "var(--card)",
  border: "1px solid var(--line)",
  borderRadius: 18,
  padding: "13px 14px",
};

const miniIcon: React.CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
