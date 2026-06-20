"use client";

import { create } from "zustand";
import {
  Goal,
  Reminders,
  Transaction,
  SEED_BALANCE,
  SEED_GOALS,
  SEED_STREAK,
  SEED_TRANSACTIONS,
} from "@/lib/seed";
import { CATS } from "@/lib/categories";
import { TODAY } from "@/lib/format";
import { ThemeName } from "@/lib/themes";
import { Currency, toFcfa } from "@/lib/currency";
import { loadApp, putGoals, putMeta, putTx, resetDb } from "@/lib/db";
import { maybeGoalAlert } from "@/lib/notify";

export type Screen =
  | "home"
  | "ops"
  | "goals"
  | "goalDetail"
  | "reminders"
  | "profile";

export type SheetMode = null | "entry" | "allocate";
export type EntryType = "in" | "out";
export type OpsTab = "list" | "stats";
export type OpsFilter = "all" | "in" | "out";

type Toast = { msg: string; icon: string } | null;

type StoreState = {
  // données persistées (IndexedDB via lib/db)
  theme: ThemeName;
  currency: Currency;
  balance: number;
  streak: number;
  transactions: Transaction[];
  goals: Goal[];
  reminders: Reminders;

  // true une fois l'état chargé depuis IndexedDB
  hydrated: boolean;

  // état UI éphémère
  screen: Screen;
  opsTab: OpsTab;
  opsFilter: OpsFilter;
  search: string;
  selGoal: string;
  sheetMode: SheetMode;
  allocGoal: string;
  entryType: EntryType;
  entryCat: string;
  entryTitle: string;
  amountStr: string;
  toast: Toast;
  toastShow: boolean;

  // actions
  hydrate: () => Promise<void>;
  go: (screen: Screen) => void;
  toggleTheme: () => void;
  setTheme: (t: ThemeName) => void;
  setCurrency: (c: Currency) => void;
  setScreen: (s: Screen) => void;
  selectGoal: (id: string) => void;

  setOpsTab: (t: OpsTab) => void;
  setOpsFilter: (f: OpsFilter) => void;
  setSearch: (q: string) => void;

  openEntry: () => void;
  openAlloc: (goalId: string) => void;
  closeSheet: () => void;
  setEntryType: (t: EntryType) => void;
  setEntryCat: (c: string) => void;
  setEntryTitle: (s: string) => void;
  press: (d: string) => void;
  del: () => void;
  addCat: () => void;
  saveSheet: () => void;

  toggleRem: (k: keyof Reminders) => void;
  showToast: (msg: string, icon?: string) => void;
  reset: () => void;
};

let toastT1: ReturnType<typeof setTimeout> | undefined;
let toastT2: ReturnType<typeof setTimeout> | undefined;

export const useStore = create<StoreState>()((set, get) => ({
  theme: "light",
  currency: "FCFA",
  balance: SEED_BALANCE,
  streak: SEED_STREAK,
  transactions: SEED_TRANSACTIONS,
  goals: SEED_GOALS,
  reminders: { daily: true, income: true, weekly: false },
  hydrated: false,

  screen: "home",
      opsTab: "list",
      opsFilter: "all",
      search: "",
      selGoal: "g1",
      sheetMode: null,
      allocGoal: "g1",
      entryType: "out",
      entryCat: "food",
      entryTitle: "",
      amountStr: "",
      toast: null,
      toastShow: false,

      hydrate: async () => {
        if (get().hydrated) return;
        const data = await loadApp();
        set({
          theme: data.theme,
          currency: data.currency,
          balance: data.balance,
          streak: data.streak,
          transactions: data.transactions,
          goals: data.goals,
          reminders: data.reminders,
          hydrated: true,
        });
      },

      go: (screen) => set({ screen, sheetMode: null }),
      toggleTheme: () =>
        set((s) => {
          const theme = s.theme === "light" ? "dark" : "light";
          putMeta({ theme });
          return { theme };
        }),
      setTheme: (theme) => {
        putMeta({ theme });
        set({ theme });
      },
      setCurrency: (currency) => {
        putMeta({ currency });
        set({ currency });
      },
      setScreen: (screen) => set({ screen }),
      selectGoal: (id) => set({ selGoal: id, screen: "goalDetail" }),

      setOpsTab: (opsTab) => set({ opsTab }),
      setOpsFilter: (opsFilter) => set({ opsFilter }),
      setSearch: (search) => set({ search }),

      openEntry: () =>
        set({
          sheetMode: "entry",
          entryType: "out",
          entryCat: "food",
          entryTitle: "",
          amountStr: "",
        }),
      openAlloc: (goalId) =>
        set({ sheetMode: "allocate", allocGoal: goalId, amountStr: "" }),
      closeSheet: () => set({ sheetMode: null }),
      setEntryType: (entryType) => set({ entryType }),
      setEntryCat: (entryCat) => set({ entryCat }),
      setEntryTitle: (entryTitle) => set({ entryTitle }),

      press: (d) =>
        set((s) => {
          let v = (s.amountStr + d).replace(/^0+/, "");
          if (v.length > 9) v = s.amountStr;
          return { amountStr: v };
        }),
      del: () => set((s) => ({ amountStr: s.amountStr.slice(0, -1) })),

      addCat: () => {
        let name: string | null = null;
        try {
          name = window.prompt("Nom de la nouvelle catégorie ?");
        } catch {}
        if (name && name.trim()) {
          const key = "c" + Date.now();
          CATS[key] = { label: name.trim().slice(0, 12), icon: "tag" };
          set({ entryCat: key });
        }
      },

      saveSheet: () => {
        const st = get();
        const amt = parseInt(st.amountStr || "0", 10);
        if (!amt) return;
        // amt saisi dans la devise affichée -> converti en FCFA (devise de base) pour le stockage
        const amtFcfa = toFcfa(amt, st.currency);

        const loggedToday = st.transactions.some((t) => t.day === TODAY);

        if (st.sheetMode === "allocate") {
          const gid = st.allocGoal;
          const prevSaved = st.goals.find((x) => x.id === gid)?.saved ?? 0;
          const goals = st.goals.map((g) =>
            g.id === gid
              ? { ...g, saved: Math.min(g.target, g.saved + amtFcfa) }
              : g
          );
          const g = goals.find((x) => x.id === gid)!;
          const tx: Transaction = {
            id: "t" + Date.now(),
            inc: false,
            amount: amtFcfa,
            cat: "saving",
            label: "Allocation " + g.name,
            day: TODAY,
            time: "maintenant",
            goal: gid,
            seq: Date.now(),
          };
          set({
            goals,
            transactions: [tx, ...st.transactions],
            sheetMode: null,
            amountStr: "",
          });
          putTx(tx);
          putGoals([g]);
          maybeGoalAlert(g, prevSaved);
          get().showToast("Alloué ! Objectif un pas plus proche 🎯", "target");
        } else {
          const inc = st.entryType === "in";
          const title =
            st.entryTitle && st.entryTitle.trim()
              ? st.entryTitle.trim()
              : inc
              ? "Entrée"
              : CATS[st.entryCat]?.label ?? "Sortie";
          const tx: Transaction = {
            id: "t" + Date.now(),
            inc,
            amount: amtFcfa,
            cat: inc ? "income" : st.entryCat,
            label: title,
            day: TODAY,
            time: "maintenant",
            seq: Date.now(),
          };
          const newStreak = loggedToday ? st.streak : st.streak + 1;
          const balance = st.balance + (inc ? amtFcfa : -amtFcfa);
          set({
            transactions: [tx, ...st.transactions],
            balance,
            streak: newStreak,
            sheetMode: null,
            amountStr: "",
            entryTitle: "",
          });
          putTx(tx);
          putMeta({ balance, streak: newStreak });
          if (!loggedToday) {
            get().showToast("Enregistré ! Série " + newStreak + " jours 🔥", "flame");
          } else {
            get().showToast("Opération enregistrée ✓", "check-circle-2");
          }
        }
      },

      toggleRem: (k) =>
        set((s) => {
          const reminders = { ...s.reminders, [k]: !s.reminders[k] };
          putMeta({ reminders });
          return { reminders };
        }),

      showToast: (msg, icon = "check-circle-2") => {
        if (toastT1) clearTimeout(toastT1);
        if (toastT2) clearTimeout(toastT2);
        set({ toast: { msg, icon }, toastShow: true });
        toastT1 = setTimeout(() => set({ toastShow: false }), 2600);
        toastT2 = setTimeout(() => set({ toast: null }), 3000);
      },

      reset: () => {
        let ok = true;
        try {
          ok = window.confirm(
            "Réinitialiser la démo ? Toutes tes opérations et objectifs reviendront aux données d'exemple."
          );
        } catch {}
        if (!ok) return;
        // remet la démo en base puis recharge l'état depuis IndexedDB
        set({ screen: "home", sheetMode: null });
        resetDb()
          .then((data) => {
            set({
              currency: data.currency,
              balance: data.balance,
              streak: data.streak,
              transactions: data.transactions,
              goals: data.goals,
              reminders: data.reminders,
            });
            get().showToast("Démo réinitialisée", "rotate-ccw");
          })
          .catch(() => get().showToast("Échec de la réinitialisation", "x"));
      },
}));
