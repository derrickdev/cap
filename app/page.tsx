"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { themeVars } from "@/lib/themes";
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

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        background: "var(--bg)",
        ...(themeVars(theme) as React.CSSProperties),
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 480,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "var(--bg)",
          // safe-area iOS (encoche / barre d'état en standalone)
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <div
          className="scrl"
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            overscrollBehavior: "contain",
            paddingTop: 10,
          }}
        >
          {hydrated ? renderScreen() : null}
        </div>

        <BottomNav />
        <BottomSheet />
        <Toast />
        <NotificationManager />
      </div>
    </div>
  );
}
