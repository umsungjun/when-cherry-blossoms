"use client";

import { useState } from "react";

import { RefreshCw, X } from "lucide-react";

import { generateNickname } from "@/lib/utils/nickname";

interface Props {
  current: string | null;
  onSave: (nickname: string) => void;
  onClose: () => void;
}

export function NicknameSetup({ current, onSave, onClose }: Props) {
  const [value, setValue] = useState(current ?? generateNickname());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="card animate-fade-in-up w-full max-w-sm space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-blossom-900 text-base font-bold">닉네임 설정</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-500">
          귀여운 닉네임으로 현장 이야기를 남겨보세요 🌸
        </p>

        <div className="flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            maxLength={16}
            className="border-blossom-200 focus:border-blossom-400 flex-1 rounded-xl border px-3 py-2 text-sm transition-colors outline-none"
          />
          <button
            onClick={() => setValue(generateNickname())}
            title="랜덤 생성"
            className="border-blossom-200 text-blossom-400 hover:bg-blossom-50 rounded-xl border p-2 transition-colors"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <button
          onClick={() => value.trim() && onSave(value.trim())}
          disabled={!value.trim()}
          className="bg-blossom-600 hover:bg-blossom-700 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-50"
        >
          저장하기
        </button>
      </div>
    </div>
  );
}
