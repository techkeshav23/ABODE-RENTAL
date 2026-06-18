const TONES = [
  "bg-cream-deep text-ink",
  "bg-saffron-soft text-ink",
  "bg-clay/15 text-clay",
  "bg-forest/15 text-forest",
  "bg-ocean/15 text-ocean",
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function tone(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return TONES[h % TONES.length];
}

export function Avatar({
  name,
  size = 40,
}: {
  name: string;
  size?: number;
}) {
  const fontPx = Math.round(size * 0.38);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-medium ${tone(
        name
      )}`}
      style={{ width: size, height: size, fontSize: fontPx }}
      aria-label={name}
    >
      {initials(name)}
    </span>
  );
}
