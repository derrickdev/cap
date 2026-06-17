"use client";

import Icon from "./Icon";
import { useStore } from "@/store/useStore";

export default function Toast() {
  const toast = useStore((s) => s.toast);
  const toastShow = useStore((s) => s.toastShow);

  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        top: 46,
        zIndex: 20,
        display: "flex",
        justifyContent: "center",
        transition:
          "transform .3s cubic-bezier(.22,1,.36,1), opacity .3s",
        transform: `translateY(${toastShow ? "0" : "-16px"})`,
        opacity: toastShow ? 1 : 0,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: "var(--hero)",
          color: "#fff",
          borderRadius: 14,
          padding: "11px 16px",
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
          maxWidth: 320,
        }}
      >
        <span style={{ color: "var(--acc)", flex: "0 0 auto", display: "flex" }}>
          <Icon name={toast?.icon ?? "check-circle-2"} size={18} strokeWidth={2.2} />
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
          {toast?.msg ?? ""}
        </span>
      </div>
    </div>
  );
}
