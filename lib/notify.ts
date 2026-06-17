"use client";

import { Goal } from "@/lib/seed";
import { pct } from "@/lib/selectors";

export type NotifPermission =
  | "default"
  | "granted"
  | "denied"
  | "unsupported";

export function notifSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getPermission(): NotifPermission {
  if (!notifSupported()) return "unsupported";
  return Notification.permission as NotifPermission;
}

export async function requestPermission(): Promise<NotifPermission> {
  if (!notifSupported()) return "unsupported";
  try {
    return (await Notification.requestPermission()) as NotifPermission;
  } catch {
    return Notification.permission as NotifPermission;
  }
}

// Affiche via le Service Worker si enregistré (notif persistante), sinon Notification directe.
async function show(title: string, options: NotificationOptions): Promise<void> {
  if (!notifSupported() || Notification.permission !== "granted") return;
  const opts: NotificationOptions = {
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    ...options,
  };
  try {
    const reg = await navigator.serviceWorker?.getRegistration();
    if (reg) {
      await reg.showNotification(title, opts);
      return;
    }
  } catch {}
  try {
    new Notification(title, opts);
  } catch {}
}

const DAILY_KEY = "cap-daily-notif"; // valeur = jour (YYYY-MM-DD) déjà notifié
const DAILY_HOUR = 20;

function todayISO(): string {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

/**
 * Rappel quotidien (client-only) : déclenche une notif locale si, ce jour,
 * il est ≥20h, aucune opération n'a été saisie, et on n'a pas déjà notifié.
 * Limite : ne s'exécute que pendant que l'app tourne (pas de push serveur).
 */
export function maybeDailyReminder(enabled: boolean, loggedToday: boolean): void {
  if (!enabled || loggedToday) return;
  if (getPermission() !== "granted") return;
  if (new Date().getHours() < DAILY_HOUR) return;

  const today = todayISO();
  try {
    if (localStorage.getItem(DAILY_KEY) === today) return;
    localStorage.setItem(DAILY_KEY, today);
  } catch {}

  show("Garde le cap 🔥", {
    body: "Note tes opérations du jour avant minuit pour garder ta série.",
    tag: "cap-daily",
  });
}

/**
 * Alerte objectif : notifie quand une allocation fait franchir un palier (75% / 100%).
 */
export function maybeGoalAlert(goal: Goal, prevSaved: number): void {
  if (getPermission() !== "granted") return;
  const before = pct(prevSaved, goal.target);
  const after = pct(goal.saved, goal.target);

  if (before < 100 && after >= 100) {
    show("Objectif atteint 🎉", {
      body: `« ${goal.name} » est financé à 100% !`,
      tag: "cap-goal-" + goal.id,
    });
  } else if (before < 75 && after >= 75) {
    show("Bientôt là 🎯", {
      body: `« ${goal.name} » dépasse 75%. Continue !`,
      tag: "cap-goal-" + goal.id,
    });
  }
}
