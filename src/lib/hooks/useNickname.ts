"use client";

import { useEffect, useState } from "react";

import { getNickname, setNickname as saveNickname } from "@/lib/firebase/auth";
import { generateNickname } from "@/lib/utils/nickname";

export function useNickname() {
  const [nickname, setNicknameState] = useState<string | null>(null);

  useEffect(() => {
    const stored = getNickname();
    if (stored) setNicknameState(stored);
  }, []);

  const assign = (name?: string) => {
    const n = name ?? generateNickname();
    saveNickname(n);
    setNicknameState(n);
    return n;
  };

  const reroll = () => assign();

  return { nickname, assign, reroll };
}
