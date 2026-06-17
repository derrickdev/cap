"use client";

import Icon from "../Icon";
import { useStore } from "@/store/useStore";
import {
  buildFeed,
  categoryStats,
  donutBackground,
  monthTotals,
  statInsightText,
} from "@/lib/selectors";
import { shortAmt } from "@/lib/currency";
import { THEMES } from "@/lib/themes";

export default function OpsScreen() {
  const s = useStore();
  const t = THEMES[s.theme];
  const cur = s.currency;

  const feed = buildFeed(s.theme, s.transactions, s.opsFilter, s.search, cur);
  const { monthOut } = monthTotals(s.transactions);
  const { catStats, segs } = categoryStats(s.transactions);
  const donutBg = donutBackground(s.theme, segs);
  const insight = statInsightText(catStats);

  const segTab = (active: boolean): React.CSSProperties =>
    active
      ? { fontWeight: 800, color: t.ink, background: t.card, boxShadow: "0 1px 2px rgba(0,0,0,.06)" }
      : { fontWeight: 700, color: t.mut };

  const pill = (active: boolean): React.CSSProperties =>
    active
      ? { color: t.accT, background: t.acc }
      : { color: t.sub, background: t.card, border: `1px solid ${t.line}` };

  return (
    <div style={{ padding: "6px 18px 26px", display: "flex", flexDirection: "column", gap: 13 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.02em" }}>
          Opérations
        </span>
        <button onClick={s.toggleTheme} className="press" style={circleBtn}>
          <Icon name={s.theme === "light" ? "moon" : "sun"} size={18} strokeWidth={2} />
        </button>
      </div>

      {/* onglets liste / stats */}
      <div style={{ display: "flex", background: "var(--chip)", border: "1px solid var(--line)", borderRadius: 11, padding: 3 }}>
        <div onClick={() => s.setOpsTab("list")} style={{ flex: 1, textAlign: "center", fontSize: 13, padding: "8px 0", borderRadius: 9, cursor: "pointer", ...segTab(s.opsTab === "list") }}>
          Liste
        </div>
        <div onClick={() => s.setOpsTab("stats")} style={{ flex: 1, textAlign: "center", fontSize: 13, padding: "8px 0", borderRadius: 9, cursor: "pointer", ...segTab(s.opsTab === "stats") }}>
          Statistiques
        </div>
      </div>

      {s.opsTab === "list" && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--card)", border: "1px solid var(--line)", borderRadius: 12, padding: "10px 13px" }}>
            <span style={{ color: "var(--fai)", display: "flex" }}>
              <Icon name="search" size={17} strokeWidth={2} />
            </span>
            <input
              value={s.search}
              onChange={(e) => s.setSearch(e.target.value)}
              placeholder="Rechercher…"
              style={{ border: 0, outline: 0, background: "transparent", fontFamily: "inherit", fontSize: 13, color: "var(--ink)", width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            <span onClick={() => s.setOpsFilter("all")} style={{ fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "6px 13px", cursor: "pointer", ...pill(s.opsFilter === "all") }}>Tout</span>
            <span onClick={() => s.setOpsFilter("in")} style={{ fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "6px 13px", cursor: "pointer", ...pill(s.opsFilter === "in") }}>Entrées</span>
            <span onClick={() => s.setOpsFilter("out")} style={{ fontSize: 12, fontWeight: 700, borderRadius: 999, padding: "6px 13px", cursor: "pointer", ...pill(s.opsFilter === "out") }}>Sorties</span>
          </div>

          {feed.map((f) =>
            f.isHeader ? (
              <div key={f.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "6px 2px 0" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "var(--fai)", letterSpacing: ".03em", textTransform: "uppercase" }}>{f.label}</span>
                <span className="tab" style={{ fontSize: 12, fontWeight: 700, color: f.sumColor }}>{f.sumFmt}</span>
              </div>
            ) : (
              <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 16 }}>
                <span style={{ width: 36, height: 36, borderRadius: 11, background: f.chipBg, color: f.chipColor, display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }}>
                  <Icon name={f.icon} size={18} strokeWidth={2} />
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: "var(--fai)", fontWeight: 500 }}>{f.catLabel} · {f.time}</div>
                </div>
                <span className="tab" style={{ fontSize: 14, fontWeight: 800, color: f.amtColor }}>{f.amtFmt}</span>
              </div>
            )
          )}
        </>
      )}

      {s.opsTab === "stats" && (
        <>
          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--sub)", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 999, padding: "5px 14px" }}>Semaine</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accT)", background: "var(--acc)", borderRadius: 999, padding: "5px 14px" }}>Mois</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--sub)", background: "var(--card)", border: "1px solid var(--line)", borderRadius: 999, padding: "5px 14px" }}>Année</span>
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--line)", borderRadius: 20, padding: 18, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 118, height: 118, borderRadius: "50%", flex: "0 0 auto", background: donutBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 84, height: 84, borderRadius: "50%", background: "var(--card)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 11, color: "var(--fai)", fontWeight: 600 }}>Dépensé</div>
                <div className="tab" style={{ fontSize: 18, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.02em" }}>{shortAmt(monthOut, cur)}</div>
              </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
              {catStats.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: c.color, flex: "0 0 auto" }} />
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: "var(--sub)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.label}</span>
                  <span className="tab" style={{ fontSize: 12.5, fontWeight: 800, color: "var(--ink)" }}>{c.pct}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "var(--hero)", borderRadius: 16, padding: 14, color: "#fff" }}>
            <span style={{ color: "var(--acc)", flex: "0 0 auto", marginTop: 1, display: "flex" }}>
              <Icon name="sparkles" size={19} strokeWidth={2.2} />
            </span>
            <span style={{ fontSize: 12.5, lineHeight: 1.45, fontWeight: 600, color: "#E4E4E7" }}>{insight}</span>
          </div>
        </>
      )}
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
