"use client";

import Icon from "../Icon";
import RingProgress from "../RingProgress";
import { useStore } from "@/store/useStore";
import { goalProjection } from "@/lib/selectors";
import { fmtAmt, curSuffix } from "@/lib/currency";

export default function GoalDetailScreen() {
  const s = useStore();
  const cur = s.currency;
  const dg = s.goals.find((g) => g.id === s.selGoal) ?? s.goals[0];
  const { dpct, remain, projTitle, projSub, coach, history } = goalProjection(dg, s.transactions, cur);

  return (
    <div style={{ padding: "6px 18px 26px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => s.go("goals")} className="press" style={{ border: 0, background: "transparent", cursor: "pointer", color: "var(--ink)", display: "flex" }}>
          <Icon name="chevron-left" size={26} strokeWidth={2.2} />
        </button>
        <span style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>Objectif</span>
        <span style={{ width: 26 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 0 2px" }}>
        <RingProgress pct={dpct} size={150} innerSize={120} innerBg="var(--bg)">
          <div className="tab" style={{ fontSize: 38, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.03em", lineHeight: 1 }}>{dpct}%</div>
          <div className="tab" style={{ fontSize: 12, fontWeight: 700, color: "var(--acc)" }}>{fmtAmt(dg.saved, cur)} {curSuffix(cur)}</div>
        </RingProgress>
        <div style={{ fontSize: 22, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.02em", marginTop: 14 }}>{dg.name}</div>
        <div className="tab" style={{ fontSize: 13, color: "var(--mut)", fontWeight: 600 }}>
          Objectif {fmtAmt(dg.target, cur)} {curSuffix(cur)} · {dg.deadline}
        </div>
      </div>

      <div style={{ display: "flex", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 18, overflow: "hidden" }}>
        <div style={{ flex: 1, padding: "13px 8px", textAlign: "center", borderRight: "1px solid var(--line)" }}>
          <div className="tab" style={{ fontSize: 15, fontWeight: 800, color: "var(--acc)" }}>{fmtAmt(dg.saved, cur)}</div>
          <div style={{ fontSize: 11, color: "var(--fai)", fontWeight: 600, marginTop: 2 }}>Épargné</div>
        </div>
        <div style={{ flex: 1, padding: "13px 8px", textAlign: "center", borderRight: "1px solid var(--line)" }}>
          <div className="tab" style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>{fmtAmt(remain, cur)}</div>
          <div style={{ fontSize: 11, color: "var(--fai)", fontWeight: 600, marginTop: 2 }}>Restant</div>
        </div>
        <div style={{ flex: 1, padding: "13px 8px", textAlign: "center" }}>
          <div className="tab" style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>{fmtAmt(dg.monthly, cur)}</div>
          <div style={{ fontSize: 11, color: "var(--fai)", fontWeight: 600, marginTop: 2 }}>/ mois</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 11, background: "var(--accS)", borderRadius: 16, padding: 14 }}>
        <span style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--acc)", color: "var(--accT)", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
          <Icon name="trending-up" size={19} strokeWidth={2.4} />
        </span>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--accI)" }}>{projTitle}</div>
          <div style={{ fontSize: 12, color: "var(--acc)", fontWeight: 600 }}>{projSub}</div>
        </div>
      </div>

      <div style={{ background: "var(--hero)", borderRadius: 18, padding: 16, color: "#fff" }}>
        <div style={{ fontSize: 13.5, lineHeight: 1.45, fontWeight: 600, color: "#E4E4E7" }}>{coach}</div>
        <button
          onClick={() => s.openAlloc(dg.id)}
          className="press"
          style={{ border: 0, width: "100%", background: "var(--acc)", color: "var(--accT)", fontWeight: 800, fontSize: 15, fontFamily: "inherit", borderRadius: 13, padding: 14, marginTop: 13, cursor: "pointer" }}
        >
          Allouer des fonds
        </button>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", margin: "0 2px 8px" }}>Allocations</div>
        <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden" }}>
          {history.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", borderBottom: "1px solid var(--line)" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--sub)" }}>{h.date}</span>
              <span className="tab" style={{ fontSize: 13.5, fontWeight: 800, color: "var(--acc)" }}>+{h.amtFmt}</span>
            </div>
          ))}
          {history.length === 0 && (
            <div style={{ padding: 14, textAlign: "center", fontSize: 12.5, color: "var(--fai)", fontWeight: 500 }}>
              Aucune allocation pour l&apos;instant.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
