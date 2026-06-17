import { Goal, Transaction } from "@/lib/seed";
import { CATS, MONTHS } from "@/lib/categories";
import { fmt, short, TODAY } from "@/lib/format";
import { CATCOLORS, ThemeName, THEMES } from "@/lib/themes";
import { Currency, fmtAmt, fmtCur } from "@/lib/currency";

const MONTH_PREFIX = "2026-06";

export function monthTotals(txs: Transaction[]) {
  const monthIn = txs
    .filter((x) => x.inc && x.day.startsWith(MONTH_PREFIX))
    .reduce((a, b) => a + b.amount, 0);
  const monthOut = txs
    .filter((x) => !x.inc && x.day.startsWith(MONTH_PREFIX))
    .reduce((a, b) => a + b.amount, 0);
  return { monthIn, monthOut, net: monthIn - monthOut };
}

export function goalTotals(goals: Goal[]) {
  const totalSaved = goals.reduce((a, b) => a + b.saved, 0);
  const totalTarget = goals.reduce((a, b) => a + b.target, 0);
  return { totalSaved, totalTarget };
}

export function pct(saved: number, target: number) {
  return Math.min(100, Math.round((saved / target) * 100));
}

export function mainGoalOf(goals: Goal[]) {
  return goals.find((g) => g.main) ?? goals[0];
}

export function dayLabel(d: string) {
  if (d === TODAY) return "Aujourd'hui";
  if (d === "2026-06-12") return "Hier";
  const p = d.split("-");
  return parseInt(p[2], 10) + " " + MONTHS[parseInt(p[1], 10) - 1];
}

export type TxView = {
  id: string;
  label: string;
  catLabel: string;
  time: string;
  icon: string;
  chipBg: string;
  chipColor: string;
  amtFmt: string;
  amtColor: string;
};

export function chipFor(theme: ThemeName, cat: string, inc: boolean) {
  const t = THEMES[theme];
  if (inc) return { bg: t.incS, color: t.inc };
  if (cat === "saving") return { bg: t.accS, color: t.acc };
  return {
    bg: theme === "light" ? "#F4F4F5" : "#27272A",
    color: theme === "light" ? "#52525B" : "#D4D4D8",
  };
}

export function txToView(theme: ThemeName, x: Transaction, cur: Currency): TxView {
  const t = THEMES[theme];
  const c = chipFor(theme, x.cat, x.inc);
  return {
    id: x.id,
    label: x.label,
    catLabel: CATS[x.cat]?.label ?? "Autre",
    time: x.time,
    icon: CATS[x.cat]?.icon ?? "tag",
    chipBg: c.bg,
    chipColor: c.color,
    amtFmt: (x.inc ? "+" : "−") + fmtAmt(x.amount, cur),
    amtColor: x.inc ? t.inc : t.ink,
  };
}

export type FeedItem =
  | { key: string; isHeader: true; isTx: false; label: string; sumFmt: string; sumColor: string }
  | (TxView & { key: string; isHeader: false; isTx: true });

export function buildFeed(
  theme: ThemeName,
  txs: Transaction[],
  filter: "all" | "in" | "out",
  search: string,
  cur: Currency
): FeedItem[] {
  const t = THEMES[theme];
  let filt = txs.slice();
  if (filter === "in") filt = filt.filter((x) => x.inc);
  if (filter === "out") filt = filt.filter((x) => !x.inc);
  if (search.trim()) {
    const q = search.toLowerCase();
    filt = filt.filter(
      (x) =>
        x.label.toLowerCase().includes(q) ||
        (CATS[x.cat] && CATS[x.cat].label.toLowerCase().includes(q))
    );
  }
  const order: string[] = [];
  const seen: Record<string, boolean> = {};
  filt.forEach((x) => {
    if (!seen[x.day]) {
      seen[x.day] = true;
      order.push(x.day);
    }
  });
  const feed: FeedItem[] = [];
  order.forEach((day) => {
    const items = filt.filter((x) => x.day === day);
    const sum = items.reduce((a, b) => a + (b.inc ? b.amount : -b.amount), 0);
    feed.push({
      key: "h" + day,
      isHeader: true,
      isTx: false,
      label: dayLabel(day),
      sumFmt: (sum >= 0 ? "+" : "−") + fmtAmt(sum, cur),
      sumColor: sum >= 0 ? t.inc : t.exp,
    });
    items.forEach((x) => {
      feed.push({ ...txToView(theme, x, cur), key: x.id, isHeader: false, isTx: true });
    });
  });
  return feed;
}

export type CatStat = { label: string; pct: number; color: string };

export function categoryStats(txs: Transaction[]) {
  const byCat: Record<string, number> = {};
  txs
    .filter((x) => !x.inc && x.day.startsWith(MONTH_PREFIX))
    .forEach((x) => {
      byCat[x.cat] = (byCat[x.cat] || 0) + x.amount;
    });
  const catArr = Object.keys(byCat)
    .map((k) => ({ cat: k, amt: byCat[k] }))
    .sort((a, b) => b.amt - a.amt);
  const totCat = catArr.reduce((a, b) => a + b.amt, 0) || 1;
  let acc = 0;
  const segs: string[] = [];
  const catStats: CatStat[] = catArr.map((c, i) => {
    const p = Math.round((c.amt / totCat) * 100);
    const col = CATCOLORS[i % CATCOLORS.length];
    const start = acc;
    acc += (c.amt / totCat) * 100;
    segs.push(col + " " + start.toFixed(1) + "% " + acc.toFixed(1) + "%");
    return { label: CATS[c.cat]?.label ?? "Autre", pct: p, color: col };
  });
  return { catStats, segs };
}

export function donutBackground(theme: ThemeName, segs: string[]) {
  const t = THEMES[theme];
  return segs.length
    ? "conic-gradient(" + segs.join(",") + ")"
    : "conic-gradient(" + t.track + " 0 100%)";
}

export function statInsightText(catStats: CatStat[]) {
  const topCat = catStats[0];
  return topCat
    ? `Ton poste n°1 ce mois : ${topCat.label} (${topCat.pct}%). Réduis-le de 15% et tu rapproches tes objectifs.`
    : "Ajoute des opérations pour voir tes statistiques.";
}

export function goalProjection(goal: Goal, txs: Transaction[], cur: Currency) {
  const dpct = pct(goal.saved, goal.target);
  const remain = Math.max(0, goal.target - goal.saved);
  const monthsLeft = goal.monthly > 0 ? Math.ceil(remain / goal.monthly) : 0;
  const reachIdx = 5 + monthsLeft;
  const reachM = MONTHS[reachIdx % 12];
  const reachY = 2026 + Math.floor(reachIdx / 12);
  const projTitle =
    remain <= 0 ? "Objectif atteint 🎉" : `Atteint en ${reachM} ${reachY}`;
  const projSub =
    remain <= 0
      ? "Bravo, objectif complété !"
      : `Au rythme de ${fmtCur(goal.monthly, cur)} / mois`;
  const coach =
    remain <= 0
      ? `« ${goal.name} » est financé à 100%. Tu peux viser un nouvel objectif !`
      : `Pour finir à temps, alloue ${fmtCur(
          goal.monthly,
          cur
        )} ce mois. Il te reste ${fmtCur(remain, cur)}.`;
  const history = txs
    .filter((x) => x.goal === goal.id)
    .map((x) => ({
      date:
        x.time === "maintenant"
          ? "Aujourd'hui"
          : parseInt(x.day.split("-")[2], 10) +
            " " +
            MONTHS[parseInt(x.day.split("-")[1], 10) - 1] +
            " 2026",
      amtFmt: fmtAmt(x.amount, cur),
    }));
  return { dpct, remain, projTitle, projSub, coach, history };
}

export { fmt, short };
