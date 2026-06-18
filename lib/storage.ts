"use client";

// A visit request is a direct, broker-free enquiry from a verified tenant to a
// verified owner — "I'd like to visit / rent this home". No payment, no broker.
export type VisitRequest = {
  id: string;
  propertyId: string;
  propertySlug: string;
  propertyName: string;
  propertyImage: string;
  city: string;
  neighborhood: string;
  ownerName: string;
  rent: number;
  visitDate: string;
  visitSlot: string;
  moveInDate: string;
  message: string;
  tenantName: string;
  tenantPhone: string;
  aadhaarLast4?: string;
  idDocName?: string;
  verified?: boolean;
  paid?: boolean;
  tokenAmount?: number;
  status: "requested" | "confirmed" | "cancelled";
  createdAt: string;
};

const RQ = "abode:requests";
const FV = "abode:favorites";
const FAV_EVENT = "abode:favorites-changed";
const RQ_EVENT = "abode:requests-changed";

const isClient = () => typeof window !== "undefined";

/* ─── visit requests ─── */

export function getRequests(): VisitRequest[] {
  if (!isClient()) return [];
  try {
    return JSON.parse(localStorage.getItem(RQ) ?? "[]") as VisitRequest[];
  } catch {
    return [];
  }
}

export function saveRequest(r: VisitRequest) {
  if (!isClient()) return;
  const list = getRequests();
  list.unshift(r);
  localStorage.setItem(RQ, JSON.stringify(list));
  window.dispatchEvent(new Event(RQ_EVENT));
}

export function findRequest(id: string): VisitRequest | undefined {
  return getRequests().find((r) => r.id === id);
}

export function cancelRequest(id: string) {
  setRequestStatus(id, "cancelled");
}

export function setRequestStatus(id: string, status: VisitRequest["status"]) {
  if (!isClient()) return;
  const list = getRequests().map((r) => (r.id === id ? { ...r, status } : r));
  localStorage.setItem(RQ, JSON.stringify(list));
  window.dispatchEvent(new Event(RQ_EVENT));
}

export function onRequestsChange(handler: () => void) {
  if (!isClient()) return () => {};
  window.addEventListener(RQ_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(RQ_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/* ─── anti-broker throttle ───
   A genuine tenant has time to visit a handful of homes; a broker juggling
   dozens of leads does not. So each visit is a real 1:1 scheduled slot, and a
   tenant can only hold a few open visits at once — which makes bulk, broker-style
   blasting impossible while costing a real seeker nothing. */

export const MAX_ACTIVE_VISITS = 3; // open (requested/confirmed) visits at a time
export const MAX_VISITS_PER_DAY = 3; // new visit requests per day

export function getActiveRequests(): VisitRequest[] {
  return getRequests().filter((r) => r.status !== "cancelled");
}

export type RequestGate = { ok: boolean; reason?: string };

export function canRequestVisit(propertySlug: string): RequestGate {
  if (!isClient()) return { ok: true };
  const all = getRequests();
  const active = all.filter((r) => r.status !== "cancelled");

  if (active.some((r) => r.propertySlug === propertySlug)) {
    return { ok: false, reason: "You already have an open visit request for this home." };
  }
  if (active.length >= MAX_ACTIVE_VISITS) {
    return {
      ok: false,
      reason: `You can hold ${MAX_ACTIVE_VISITS} open visits at a time. Complete or cancel one to schedule another — real visits take time, which is exactly what keeps brokers out.`,
    };
  }
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = all.filter((r) => r.createdAt.slice(0, 10) === today).length;
  if (todayCount >= MAX_VISITS_PER_DAY) {
    return {
      ok: false,
      reason: `You can schedule ${MAX_VISITS_PER_DAY} visits per day. One-at-a-time scheduling is what a broker handling dozens of homes can't keep up with.`,
    };
  }
  return { ok: true };
}

/* ─── saved homes (favorites) ─── */

export function getFavorites(): string[] {
  if (!isClient()) return [];
  try {
    return JSON.parse(localStorage.getItem(FV) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function isFavorite(slug: string): boolean {
  return getFavorites().includes(slug);
}

export function toggleFavorite(slug: string): boolean {
  if (!isClient()) return false;
  const list = getFavorites();
  const i = list.indexOf(slug);
  if (i >= 0) list.splice(i, 1);
  else list.push(slug);
  localStorage.setItem(FV, JSON.stringify(list));
  window.dispatchEvent(new Event(FAV_EVENT));
  return i < 0;
}

export function onFavoritesChange(handler: () => void) {
  if (!isClient()) return () => {};
  window.addEventListener(FAV_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(FAV_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/* ─── helpers ─── */

export function newRequestId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VR-${rand}`;
}

export function formatINR(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}
