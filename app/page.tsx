"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { themeVars } from "@/lib/themes";
import StatusBar from "@/components/StatusBar";
import BottomNav from "@/components/BottomNav";
import BottomSheet from "@/components/BottomSheet";
import Toast from "@/components/Toast";
import NotificationManager from "@/components/NotificationManager";
import HomeScreen from "@/components/screens/HomeScreen";
import OpsScreen from "@/components/screens/OpsScreen";
import GoalsScreen from "@/components/screens/GoalsScreen";
import GoalDetailScreen from "@/components/screens/GoalDetailScreen";
import RemindersScreen from "@/components/screens/RemindersScreen";
import ProfileScreen from "@/components/screens/ProfileScreen";

export default function Page() {
  const screen = useStore((s) => s.screen);
  const theme = useStore((s) => s.theme);
  const hydrated = useStore((s) => s.hydrated);
  const hydrate = useStore((s) => s.hydrate);

  // Charge l'état depuis IndexedDB côté client (évite aussi le mismatch d'hydratation).
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <HomeScreen />;
      case "ops":
        return <OpsScreen />;
      case "goals":
        return <GoalsScreen />;
      case "goalDetail":
        return <GoalDetailScreen />;
      case "reminders":
        return <RemindersScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const showNav = screen !== "reminders" && screen !== "goalDetail";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 390,
            maxWidth: "100%",
            background: "#111114",
            padding: 11,
            borderRadius: 58,
            boxShadow: "0 40px 80px -24px rgba(0,0,0,.5)",
          }}
        >
          <div
            className="scrl"
            style={{
              position: "relative",
              width: 368,
              maxWidth: "100%",
              height: 800,
              borderRadius: 47,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              background: "var(--bg)",
              ...(themeVars(theme) as React.CSSProperties),
            }}
          >
            <StatusBar />

            <div className="scrl" style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
              {hydrated ? renderScreen() : null}
            </div>

            <BottomNav />
            <BottomSheet />
            <Toast />
            <NotificationManager />
          </div>
        </div>
      </div>
    </div>
  );
}
