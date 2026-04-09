import { doc, getDoc, setDoc } from "firebase/firestore";

import type { RegionPrediction } from "@/lib/api/prediction";

import { getDb } from "./config";

const PREDICTIONS_DOC = () => doc(getDb(), "cache", "ai-predictions");

export interface StoredPredictions {
  data: Record<string, RegionPrediction>;
  updatedAt: number;
}

/** Firestore에서 AI 예측 캐시 읽기 */
export async function readFirestorePredictions(): Promise<StoredPredictions | null> {
  try {
    const snap = await getDoc(PREDICTIONS_DOC());
    if (!snap.exists()) return null;
    const d = snap.data() as StoredPredictions;
    if (!d.data || !d.updatedAt) return null;
    return d;
  } catch {
    return null;
  }
}

/** Firestore에 AI 예측 캐시 저장 */
export async function writeFirestorePredictions(
  data: Record<string, RegionPrediction>,
  updatedAt: number
): Promise<void> {
  try {
    await setDoc(PREDICTIONS_DOC(), { data, updatedAt });
  } catch (e) {
    console.error("Firestore predictions write failed:", e);
  }
}
