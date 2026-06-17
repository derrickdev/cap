"use client";

import Icon from "./Icon";

type Props = {
  pct: number;
  size: number;
  innerSize: number;
  /** Couleur de fond du disque intérieur (var(--card) ou var(--bg)). */
  innerBg?: string;
  /** Contenu central : pourcentage (par défaut) ou une icône. */
  children?: React.ReactNode;
};

export default function RingProgress({
  pct,
  size,
  innerSize,
  innerBg = "var(--card)",
  children,
}: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `conic-gradient(var(--acc) ${pct}%, var(--track) 0)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
      }}
    >
      <div
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: "50%",
          background: innerBg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function RingIcon({
  pct,
  size,
  innerSize,
  icon,
}: {
  pct: number;
  size: number;
  innerSize: number;
  icon: string;
}) {
  return (
    <RingProgress pct={pct} size={size} innerSize={innerSize}>
      <span style={{ color: "var(--acc)", display: "flex" }}>
        <Icon name={icon} size={20} strokeWidth={2} />
      </span>
    </RingProgress>
  );
}
