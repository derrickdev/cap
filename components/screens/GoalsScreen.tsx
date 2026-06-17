"use client";

import Icon from "../Icon";
import { RingIcon } from "../RingProgress";
import { useStore } from "@/store/useStore";
import { goalTotals, pct } from "@/lib/selectors";
import { fmtAmt, curSuffix } from "@/lib/currency";

export default function GoalsScreen() {
  const s = useStore();
  const cur = s.currency;
  const { totalSaved, totalTarget } = goalTotals(s.goals);
  const allPct = Math.round((totalSaved / totalTarget) * 100);

  return (
    <div style={{ padding: "6px 18px 26px", display: "flex", flexDirection: "column", gap: 13 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.02em" }}>Objectifs</span>
        <button
          onClick={() => s.showToast("Création d’objectif — bientôt dans la démo", "target")}
          className="press"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            border: 0,
            background: "var(--acc)",
            color: "var(--accT)",
            fontWeight: 700,
            fontSize: 12.5,
            fontFamily: "inherit",
            borderRadius: 10,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          <Icon name="plus" size={15} strokeWidth={2.6} />
          Nouvel
        </button>
      </div>

      <div style={{ background: "var(--hero)", borderRadius: 20, padding: 18, color: "#fff" }}>
        <div style={{ fontSize: 13, color: "#A1A1AA", fontWeight: 500 }}>
          Épargne totale · {s.goals.length} objectifs
        </div>
        <div style={{ margin: "6px 0 10px", fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1 }}>
          <span className="tab" style={{ fontSize: 30 }}>{fmtAmt(totalSaved, cur)}</span>{" "}
          <span style={{ fontSize: 14, color: "#71717A", fontWeight: 700 }}>/ {fmtAmt(totalTarget, cur)}</span>
        </div>
        <div style={{ height: 7, borderRadius: 999, background: "rgba(255,255,255,.13)", overflow: "hidden" }}>
          <div style={{ width: `${allPct}%`, height: "100%", background: "var(--acc)", borderRadius: 999 }} />
        </div>
      </div>

      {s.goals.map((g) => {
        const p = pct(g.saved, g.target);
        return (
          <button
            key={g.id}
            onClick={() => s.selectGoal(g.id)}
            className="press"
            style={{
              textAlign: "left",
              fontFamily: "inherit",
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: 18,
              padding: 14,
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
            }}
          >
            <RingIcon pct={p} size={54} innerSize={40} icon={g.icon} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)", whiteSpace: "nowrap" }}>{g.name}</span>
                {g.main && (
                  <span style={{ color: "#F59E0B", display: "flex" }}>
                    <Icon name="star" size={13} strokeWidth={2.4} fill="#F59E0B" />
                  </span>
                )}
              </div>
              <div className="tab" style={{ fontSize: 12.5, color: "var(--sub)", fontWeight: 600, marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {fmtAmt(g.saved, cur)} / {fmtAmt(g.target, cur)} {curSuffix(cur)}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--fai)", fontWeight: 600, marginTop: 2 }}>{g.deadline}</div>
            </div>
            <span className="tab" style={{ fontSize: 16, fontWeight: 900, color: "var(--acc)", flex: "0 0 auto" }}>{p}%</span>
          </button>
        );
      })}
    </div>
  );
}
