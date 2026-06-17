"use client";

import { icons } from "lucide-react";

type Props = {
  name: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  fill?: string;
  style?: React.CSSProperties;
};

/** Convertit "arrow-up-right" -> "ArrowUpRight" pour matcher les exports lucide-react. */
function toPascal(name: string): string {
  return name
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

export default function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  color = "currentColor",
  fill = "none",
  style,
}: Props) {
  const key = toPascal(name) as keyof typeof icons;
  const Cmp = icons[key] ?? icons.Tag;
  return (
    <Cmp
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      fill={fill}
      style={style}
    />
  );
}
