export type Transaction = {
  id: string;
  inc: boolean;
  amount: number;
  cat: string;
  label: string;
  day: string;
  time: string;
  goal?: string;
  seq?: number; // ordre de tri persisté (plus récent = plus grand)
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  icon: string;
  main: boolean;
  monthly: number;
};

export type Reminders = { daily: boolean; income: boolean; weekly: boolean };

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: "t1", inc: false, amount: 18000, cat: "food", label: "Courses Erevan", day: "2026-06-13", time: "18:24" },
  { id: "t2", inc: false, amount: 2500, cat: "transport", label: "Taxi", day: "2026-06-13", time: "12:10" },
  { id: "t3", inc: true, amount: 850000, cat: "income", label: "Salaire", day: "2026-06-12", time: "09:02" },
  { id: "t4", inc: false, amount: 50000, cat: "saving", label: "Allocation Voiture", day: "2026-06-12", time: "10:30", goal: "g1" },
  { id: "t5", inc: false, amount: 12000, cat: "fun", label: "Restaurant Tropicana", day: "2026-06-12", time: "20:15" },
  { id: "t6", inc: false, amount: 9000, cat: "food", label: "Marché", day: "2026-06-11", time: "08:00" },
  { id: "t7", inc: false, amount: 15000, cat: "family", label: "Transfert maman", day: "2026-06-10", time: "14:00" },
];

export const SEED_GOALS: Goal[] = [
  { id: "g1", name: "Voiture", target: 1000000, saved: 620000, deadline: "déc. 2026", icon: "car", main: true, monthly: 47500 },
  { id: "g2", name: "Fonds d’urgence", target: 750000, saved: 300000, deadline: "Sans échéance", icon: "shield-check", main: true, monthly: 25000 },
  { id: "g3", name: "Voyage Dubaï", target: 500000, saved: 180000, deadline: "mars 2027", icon: "plane", main: false, monthly: 20000 },
  { id: "g4", name: "Projet business", target: 1000000, saved: 75000, deadline: "déc. 2027", icon: "briefcase", main: false, monthly: 30000 },
];

export const SEED_BALANCE = 1245000;
export const SEED_STREAK = 8;
