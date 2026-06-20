/** 1245000 -> "1 245 000" (espaces fines, comme le design). */
export function fmt(n: number): string {
  const s = Math.round(Math.abs(n)).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Forme courte : 1 200 000 -> "1,2M" ; 47500 -> "48k". */
export function short(n: number): string {
  if (n >= 1_000_000) {
    return (Math.round(n / 100_000) / 10).toString().replace(".", ",") + "M";
  }
  if (n >= 1000) return Math.round(n / 1000) + "k";
  return n.toString();
}

/** Date du "jour" simulée (alignée sur le seed du design). */
export const TODAY = "2026-06-13";

/** "Awa B." -> "AB" ; "awa" -> "AW". Pour l'avatar. */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Premier mot du nom, pour le "Bonsoir, X". */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "";
}
