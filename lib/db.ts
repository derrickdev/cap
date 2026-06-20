"use client";

import Dexie, { type Table } from "dexie";
import {
  Goal,
  Reminders,
  Transaction,
  SEED_BALANCE,
  SEED_GOALS,
  SEED_STREAK,
  SEED_TRANSACTIONS,
} from "@/lib/seed";
import { ThemeName } from "@/lib/themes";
import { Currency } from "@/lib/currency";

// Une ligne de la table clé/valeur (theme, currency, balance, streak, reminders, flags).
export type MetaRow = { key: string; value: unknown };

export type AppData = {
  theme: ThemeName;
  currency: Currency;
  name: string;
  balance: number;
  streak: number;
  reminders: Reminders;
  transactions: Transaction[];
  goals: Goal[];
};

const DEFAULT_REMINDERS: Reminders = { daily: true, income: true, weekly: false };

class CapDB extends Dexie {
  transactions!: Table<Transaction, string>;
  goals!: Table<Goal, string>;
  meta!: Table<MetaRow, string>;

  constructor() {
    super("cap-db");
    this.version(1).stores({
      // seq indexé pour trier les opérations (plus récent = seq le plus grand)
      transactions: "id, seq, day, inc, cat, goal",
      goals: "id, main",
      meta: "key",
    });
  }
}

export const db = new CapDB();

// Assigne un seq décroissant : index 0 (plus récent) → seq le plus grand.
function withSeq(txs: Transaction[]): Transaction[] {
  const n = txs.length;
  return txs.map((t, i) => ({ ...t, seq: t.seq ?? n - i }));
}

// Récupère l'ancien état zustand persist (localStorage cap-store-v1) s'il existe.
function migrateFromLocalStorage(): Partial<AppData> | null {
  try {
    const raw = localStorage.getItem("cap-store-v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const s = parsed?.state ?? parsed;
    if (!s) return null;
    return {
      theme: s.theme,
      currency: s.currency,
      balance: s.balance,
      streak: s.streak,
      reminders: s.reminders,
      name: typeof s.name === "string" ? s.name : undefined,
      transactions: Array.isArray(s.transactions) ? s.transactions : undefined,
      goals: Array.isArray(s.goals) ? s.goals : undefined,
    };
  } catch {
    return null;
  }
}

let seedPromise: Promise<void> | null = null;

async function ensureSeeded(): Promise<void> {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    const seeded = await db.meta.get("seeded");
    if (seeded?.value) return;

    const old = migrateFromLocalStorage();
    const transactions = withSeq(old?.transactions ?? SEED_TRANSACTIONS);
    const goals = old?.goals ?? SEED_GOALS;
    const metaRows: MetaRow[] = [
      { key: "theme", value: old?.theme ?? "light" },
      { key: "currency", value: old?.currency ?? "FCFA" },
      { key: "name", value: old?.name ?? "" },
      { key: "balance", value: old?.balance ?? SEED_BALANCE },
      { key: "streak", value: old?.streak ?? SEED_STREAK },
      { key: "reminders", value: old?.reminders ?? DEFAULT_REMINDERS },
      { key: "seeded", value: true },
    ];

    await db.transaction("rw", db.transactions, db.goals, db.meta, async () => {
      await db.transactions.bulkPut(transactions);
      await db.goals.bulkPut(goals);
      await db.meta.bulkPut(metaRows);
    });

    // Ancien store migré : on retire la clé localStorage pour éviter une double source.
    if (old) {
      try {
        localStorage.removeItem("cap-store-v1");
      } catch {}
    }
  })();
  return seedPromise;
}

export async function loadApp(): Promise<AppData> {
  await ensureSeeded();
  const [transactions, goals, metaRows] = await Promise.all([
    db.transactions.orderBy("seq").reverse().toArray(),
    db.goals.orderBy("id").toArray(),
    db.meta.toArray(),
  ]);
  const meta: Record<string, unknown> = {};
  metaRows.forEach((r) => (meta[r.key] = r.value));
  return {
    theme: (meta.theme as ThemeName) ?? "light",
    currency: (meta.currency as Currency) ?? "FCFA",
    name: (meta.name as string) ?? "",
    balance: (meta.balance as number) ?? SEED_BALANCE,
    streak: (meta.streak as number) ?? SEED_STREAK,
    reminders: (meta.reminders as Reminders) ?? DEFAULT_REMINDERS,
    transactions,
    goals,
  };
}

// Write-through helpers (fire-and-forget depuis les actions du store).
export function putTx(tx: Transaction): Promise<string> {
  return db.transactions.put(tx);
}

export function putGoals(goals: Goal[]): Promise<unknown> {
  return db.goals.bulkPut(goals);
}

export function putMeta(partial: Record<string, unknown>): Promise<unknown> {
  return db.meta.bulkPut(
    Object.entries(partial).map(([key, value]) => ({ key, value }))
  );
}

// Vide tout : aucune opération, aucun objectif, solde + série à 0.
// theme / currency / reminders conservés.
export async function emptyDb(): Promise<AppData> {
  await db.transaction("rw", db.transactions, db.goals, db.meta, async () => {
    await Promise.all([db.transactions.clear(), db.goals.clear()]);
    await db.meta.bulkPut([
      { key: "balance", value: 0 },
      { key: "streak", value: 0 },
      { key: "seeded", value: true },
    ]);
  });
  return loadApp();
}

// Réinitialise la base aux données de démo. theme + currency conservés.
export async function resetDb(): Promise<AppData> {
  await db.transaction("rw", db.transactions, db.goals, db.meta, async () => {
    await Promise.all([db.transactions.clear(), db.goals.clear()]);
    await db.transactions.bulkPut(withSeq(SEED_TRANSACTIONS));
    await db.goals.bulkPut(SEED_GOALS);
    // n'écrase que les données de démo, pas theme/currency
    await db.meta.bulkPut([
      { key: "balance", value: SEED_BALANCE },
      { key: "streak", value: SEED_STREAK },
      { key: "reminders", value: DEFAULT_REMINDERS },
      { key: "seeded", value: true },
    ]);
  });
  return loadApp();
}
