"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { TODAY } from "@/lib/format";
import { maybeDailyReminder } from "@/lib/notify";

// Vérifie le rappel quotidien pendant que l'app tourne (toutes les 5 min + au montage).
export default function NotificationManager() {
  const hydrated = useStore((s) => s.hydrated);
  const dailyOn = useStore((s) => s.reminders.daily);
  const transactions = useStore((s) => s.transactions);

  useEffect(() => {
    if (!hydrated) return;
    const check = () => {
      const loggedToday = transactions.some((t) => t.day === TODAY);
      maybeDailyReminder(dailyOn, loggedToday);
    };
    check();
    const id = window.setInterval(check, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [hydrated, dailyOn, transactions]);

  return null;
}
