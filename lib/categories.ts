export type CategoryDef = { label: string; icon: string };

export const CATS: Record<string, CategoryDef> = {
  food: { label: "Nourriture", icon: "utensils" },
  transport: { label: "Transport", icon: "bus" },
  fun: { label: "Sorties", icon: "party-popper" },
  saving: { label: "Épargne", icon: "piggy-bank" },
  business: { label: "Business", icon: "briefcase" },
  family: { label: "Famille", icon: "users" },
  health: { label: "Santé", icon: "heart-pulse" },
  income: { label: "Revenu", icon: "wallet" },
  other: { label: "Autre", icon: "tag" },
};

export const MONTHS = [
  "janv.",
  "févr.",
  "mars",
  "avr.",
  "mai",
  "juin",
  "juil.",
  "août",
  "sept.",
  "oct.",
  "nov.",
  "déc.",
];

export function catLabel(key: string): string {
  return CATS[key]?.label ?? "Autre";
}

export function catIcon(key: string): string {
  return CATS[key]?.icon ?? "tag";
}
