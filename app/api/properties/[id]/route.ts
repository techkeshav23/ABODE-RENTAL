import { NextResponse } from "next/server";
import { PROPERTIES, getOwner } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = PROPERTIES.find((p) => p.id === id || p.slug === id);
  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Safe, public-facing owner summary only — never expose private fields.
  const fullOwner = getOwner(property.ownerId);
  const owner = fullOwner
    ? { name: fullOwner.name, verified: fullOwner.verified, since: fullOwner.since }
    : null;

  const related = PROPERTIES.filter(
    (p) => p.id !== property.id && p.city === property.city
  ).slice(0, 4);

  return NextResponse.json({ property, owner, related });
}
