"use client";

import { Goal, Transaction } from "@/lib/seed";
import { Currency, fmtCur } from "@/lib/currency";
import { monthTotals, goalTotals, pct, dayLabel } from "@/lib/selectors";
import { CATS } from "@/lib/categories";

type ReportInput = {
  balance: number;
  streak: number;
  currency: Currency;
  transactions: Transaction[];
  goals: Goal[];
};

// Génère et télécharge un rapport PDF de l'état actuel (jsPDF, import dynamique).
export async function exportReport(data: ReportInput): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const cur = data.currency;
  const M = 48; // marge gauche
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  let y = 64;

  const line = (txt: string, size = 11, bold = false, color = 40) => {
    if (y > H - 48) {
      doc.addPage();
      y = 64;
    }
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
    doc.text(txt, M, y);
    y += size + 8;
  };

  const rule = () => {
    doc.setDrawColor(220);
    doc.line(M, y, W - M, y);
    y += 16;
  };

  // En-tête
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(20);
  doc.text("Cap — Rapport budget", M, y);
  y += 14;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(130);
  doc.text("Généré le " + new Date().toLocaleString("fr-FR"), M, y);
  y += 24;
  rule();

  // Synthèse
  const { monthIn, monthOut, net } = monthTotals(data.transactions);
  line("Synthèse", 14, true, 20);
  line("Solde total : " + fmtCur(data.balance, cur), 12, true);
  line("Entrées (juin) : " + fmtCur(monthIn, cur));
  line("Sorties (juin) : " + fmtCur(monthOut, cur));
  line("Net (juin) : " + (net >= 0 ? "+" : "-") + fmtCur(Math.abs(net), cur));
  line("Série quotidienne : " + data.streak + " jours");
  y += 6;
  rule();

  // Objectifs
  const { totalSaved, totalTarget } = goalTotals(data.goals);
  line("Objectifs", 14, true, 20);
  line(
    "Épargne totale : " +
      fmtCur(totalSaved, cur) +
      " / " +
      fmtCur(totalTarget, cur),
    12,
    true
  );
  data.goals.forEach((g) => {
    line(
      "• " +
        g.name +
        " — " +
        pct(g.saved, g.target) +
        "% (" +
        fmtCur(g.saved, cur) +
        " / " +
        fmtCur(g.target, cur) +
        ") · " +
        g.deadline,
      10,
      false,
      70
    );
  });
  y += 6;
  rule();

  // Opérations
  line("Opérations", 14, true, 20);
  data.transactions.forEach((tx) => {
    const sign = tx.inc ? "+" : "-";
    const catLabel = CATS[tx.cat]?.label ?? "Autre";
    line(
      dayLabel(tx.day) +
        " · " +
        tx.label +
        " (" +
        catLabel +
        ") : " +
        sign +
        fmtCur(tx.amount, cur),
      10,
      false,
      70
    );
  });

  doc.save("cap-rapport.pdf");
}
