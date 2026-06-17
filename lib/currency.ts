import { fmt, short } from "@/lib/format";

// Devise de base du compte = FCFA (XOF). Tous les montants sont stockés en FCFA.
// Les autres devises sont purement de l'affichage/saisie (conversion via taux).
export type Currency = "FCFA" | "EUR" | "USD";

// Taux : combien de FCFA vaut 1 unité de la devise.
const RATE: Record<Currency, number> = {
  FCFA: 1,
  EUR: 655.957, // parité fixe XOF/EUR
  USD: 600, // approximatif
};

const SUFFIX: Record<Currency, string> = {
  FCFA: "FCFA",
  EUR: "€",
  USD: "$",
};

export const CURRENCIES: { code: Currency; label: string }[] = [
  { code: "FCFA", label: "FCFA" },
  { code: "EUR", label: "Euro (€)" },
  { code: "USD", label: "Dollar ($)" },
];

export function curSuffix(c: Currency): string {
  return SUFFIX[c];
}

// Montant saisi (dans la devise affichée) -> FCFA pour le stockage.
export function toFcfa(amount: number, c: Currency): number {
  return Math.round(amount * RATE[c]);
}

// FCFA stocké -> valeur dans la devise affichée.
export function fromFcfa(fcfa: number, c: Currency): number {
  return fcfa / RATE[c];
}

// Nombre formaté dans la devise (sans suffixe).
export function fmtAmt(fcfa: number, c: Currency): string {
  return fmt(fromFcfa(fcfa, c));
}

// Nombre formaté + suffixe de devise.
export function fmtCur(fcfa: number, c: Currency): string {
  return fmt(fromFcfa(fcfa, c)) + " " + SUFFIX[c];
}

// Forme courte convertie (sans suffixe), pour les pastilles / donut.
export function shortAmt(fcfa: number, c: Currency): string {
  return short(fromFcfa(fcfa, c));
}
