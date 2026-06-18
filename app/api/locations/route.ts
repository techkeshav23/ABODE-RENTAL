import { NextResponse } from "next/server";
import { CITIES, PROPERTIES } from "@/lib/data";

export async function GET() {
  const counts = CITIES.map((city) => ({
    city,
    count: PROPERTIES.filter((p) => p.city === city).length,
  }));
  return NextResponse.json({ cities: counts });
}
