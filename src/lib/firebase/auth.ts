"use client";

import { signInAnonymously } from "firebase/auth";

import { getFirebaseAuth } from "./config";

const NICKNAME_KEY = "cherry_nickname";
const UID_KEY = "cherry_uid";

/** 익명 로그인 (이미 로그인된 경우 스킵) */
export async function ensureAuth(): Promise<string> {
  const auth = getFirebaseAuth();

  // 저장된 UID 재사용
  const cached = localStorage.getItem(UID_KEY);
  if (cached && auth.currentUser?.uid === cached) {
    return cached;
  }

  const cred = await signInAnonymously(auth);
  localStorage.setItem(UID_KEY, cred.user.uid);
  return cred.user.uid;
}

export function getNickname(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(NICKNAME_KEY);
}

export function setNickname(nickname: string): void {
  localStorage.setItem(NICKNAME_KEY, nickname);
}

export function getStoredUid(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(UID_KEY);
}
