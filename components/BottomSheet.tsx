"use client";

import Icon from "./Icon";
import { useStore } from "@/store/useStore";
import { CATS } from "@/lib/categories";
import { fmt } from "@/lib/format";
import { curSuffix } from "@/lib/currency";
import { THEMES } from "@/lib/themes";

export default function BottomSheet() {
  const s = useStore();
  const t = THEMES[s.theme];

  const isEntry = s.sheetMode === "entry";
  const isAlloc = s.sheetMode === "allocate";
  const open = !!s.sheetMode;

  const amtNum = parseInt(s.amountStr || "0", 10);
  const amtDisplay = s.amountStr ? fmt(amtNum) : "0";
  const sign = isAlloc ? "+" : s.entryType === "in" ? "+" : "−";
  const signColor = isAlloc ? t.acc : s.entryType === "in" ? t.inc : t.exp;

  const allocG = s.goals.find((g) => g.id === s.allocGoal) ?? s.goals[0];
  const sheetTitle = isAlloc ? "Allouer à " + allocG.name : "Nouvelle opération";

  const inActive = s.entryType === "in";
  const inTabStyle: React.CSSProperties = inActive
    ? {
        fontWeight: 800,
        color: t.ink,
        background: t.card,
        boxShadow: "0 1px 2px rgba(0,0,0,.06)",
      }
    : { fontWeight: 700, color: t.mut };
  const outTabStyle: React.CSSProperties = !inActive
    ? { fontWeight: 800, color: "#fff", background: t.exp }
    : { fontWeight: 700, color: t.mut };

  const catKeys = Object.keys(CATS).filter((k) => k !== "income");

  const keypad: { label: string; onClick: () => void; muted?: boolean; icon?: string }[] = [
    { label: "1", onClick: () => s.press("1") },
    { label: "2", onClick: () => s.press("2") },
    { label: "3", onClick: () => s.press("3") },
    { label: "4", onClick: () => s.press("4") },
    { label: "5", onClick: () => s.press("5") },
    { label: "6", onClick: () => s.press("6") },
    { label: "7", onClick: () => s.press("7") },
    { label: "8", onClick: () => s.press("8") },
    { label: "9", onClick: () => s.press("9") },
    { label: "000", onClick: () => s.press("000"), muted: true },
    { label: "0", onClick: () => s.press("0") },
    { label: "", onClick: () => s.del(), icon: "delete" },
  ];

  const saveLabel = isAlloc ? "Allouer" : "Enregistrer";
  const saveBg = isAlloc ? t.acc : t.ink;
  const saveColor = isAlloc ? t.accT : "#fff";

  return (
    <>
      <div
        onClick={s.closeSheet}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,.45)",
          transition: "opacity .25s",
          zIndex: 8,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          background: "var(--sheet)",
          borderRadius: "28px 28px 0 0",
          zIndex: 9,
          transition: "transform .3s cubic-bezier(.22,1,.36,1)",
          transform: `translateY(${open ? "0%" : "105%"})`,
          boxShadow: "0 -10px 40px rgba(0,0,0,.2)",
        }}
      >
        <div
          style={{
            padding: "16px 20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 38,
              height: 4,
              borderRadius: 99,
              background: "var(--line)",
              margin: "0 auto 2px",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              onClick={s.closeSheet}
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--mut)",
                cursor: "pointer",
              }}
            >
              Annuler
            </span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "var(--ink)" }}>
              {sheetTitle}
            </span>
            <span style={{ width: 46 }} />
          </div>

          {isEntry && (
            <div
              style={{
                display: "flex",
                background: "var(--chip)",
                border: "1px solid var(--line)",
                borderRadius: 13,
                padding: 4,
              }}
            >
              <div
                onClick={() => s.setEntryType("in")}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 14,
                  padding: "9px 0",
                  borderRadius: 10,
                  cursor: "pointer",
                  ...inTabStyle,
                }}
              >
                Entrée
              </div>
              <div
                onClick={() => s.setEntryType("out")}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 14,
                  padding: "9px 0",
                  borderRadius: 10,
                  cursor: "pointer",
                  ...outTabStyle,
                }}
              >
                Sortie
              </div>
            </div>
          )}

          <div style={{ textAlign: "center", padding: "6px 0 2px" }}>
            <div
              style={{
                fontWeight: 900,
                letterSpacing: "-.03em",
                color: "var(--ink)",
                lineHeight: 1,
              }}
            >
              <span style={{ fontSize: 28, color: signColor }}>{sign}</span>{" "}
              <span className="tab" style={{ fontSize: 44 }}>
                {amtDisplay}
              </span>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--fai)",
                fontWeight: 700,
                marginTop: 6,
              }}
            >
              {curSuffix(s.currency)}
            </div>
          </div>

          {isEntry && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 9,
              }}
            >
              {catKeys.map((k) => {
                const sel = s.entryCat === k;
                return (
                  <div
                    key={k}
                    onClick={() => s.setEntryCat(k)}
                    className="press"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                      padding: "11px 4px",
                      borderRadius: 14,
                      cursor: "pointer",
                      background: sel ? t.accS : t.chip,
                      border: `1.5px solid ${sel ? t.acc : t.line}`,
                      color: sel ? t.acc : t.mut,
                    }}
                  >
                    <Icon name={CATS[k].icon} size={20} strokeWidth={2} />
                    <span style={{ fontSize: 10.5, fontWeight: 700 }}>
                      {CATS[k].label}
                    </span>
                  </div>
                );
              })}
              <div
                onClick={s.addCat}
                className="press"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "11px 4px",
                  borderRadius: 14,
                  cursor: "pointer",
                  background: "transparent",
                  border: `1.5px dashed ${t.line}`,
                  color: t.fai,
                }}
              >
                <Icon name="plus" size={20} strokeWidth={2} />
                <span style={{ fontSize: 10.5, fontWeight: 700 }}>Ajouter</span>
              </div>
            </div>
          )}

          {isEntry && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--chip)",
                border: "1px solid var(--line)",
                borderRadius: 12,
                padding: "11px 13px",
              }}
            >
              <span style={{ color: "var(--fai)", flex: "0 0 auto", display: "flex" }}>
                <Icon name="pencil-line" size={17} strokeWidth={2} />
              </span>
              <input
                value={s.entryTitle}
                onChange={(e) => s.setEntryTitle(e.target.value)}
                placeholder="Intitulé (ex. Courses, Taxi…)"
                style={{
                  border: 0,
                  outline: 0,
                  background: "transparent",
                  fontFamily: "inherit",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--ink)",
                  width: "100%",
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 8,
            }}
          >
            {keypad.map((k, i) => (
              <button
                key={i}
                onClick={k.onClick}
                className="kbtn"
                style={{
                  border: 0,
                  background: "transparent",
                  fontFamily: "inherit",
                  fontSize: k.muted ? 20 : 24,
                  fontWeight: 700,
                  color: k.muted ? "var(--mut)" : "var(--ink)",
                  padding: "12px 0",
                  borderRadius: 12,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {k.icon ? (
                  <span style={{ color: "var(--mut)", display: "flex" }}>
                    <Icon name={k.icon} size={24} strokeWidth={2} />
                  </span>
                ) : (
                  k.label
                )}
              </button>
            ))}
          </div>

          <button
            onClick={s.saveSheet}
            className="press"
            style={{
              border: 0,
              background: saveBg,
              color: saveColor,
              opacity: amtNum ? 1 : 0.42,
              transition: "opacity .15s",
              fontWeight: 800,
              fontSize: 15.5,
              fontFamily: "inherit",
              borderRadius: 15,
              padding: 16,
              cursor: "pointer",
              letterSpacing: "-.01em",
            }}
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </>
  );
}
