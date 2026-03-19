"use client";

import { FormEvent, useState } from "react";

import { Send } from "lucide-react";

import { ensureAuth } from "@/lib/firebase/auth";
import { addComment } from "@/lib/firebase/comments";
import { useComments } from "@/lib/hooks/useComments";
import { useNickname } from "@/lib/hooks/useNickname";
import { cn } from "@/lib/utils/cn";
import { timeAgo } from "@/lib/utils/date";

import { NicknameSetup } from "./NicknameSetup";

interface Props {
  regionId: string;
}

export function CommentSection({ regionId }: Props) {
  const { comments, loading } = useComments(regionId);
  const { nickname, assign } = useNickname();
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!nickname) {
      setShowNicknameModal(true);
      return;
    }

    setSubmitting(true);
    try {
      const uid = await ensureAuth();
      await addComment(regionId, nickname, content.trim(), uid);
      setContent("");
    } catch {
      alert("댓글 등록에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-blossom-900 text-base font-bold">
          🌸 현장 이야기 ({comments.length})
        </h3>
        {nickname && (
          <button
            onClick={() => setShowNicknameModal(true)}
            className="hover:text-blossom-400 text-xs text-gray-400 transition-colors"
          >
            {nickname} ✏️
          </button>
        )}
      </div>

      {/* 입력 폼 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={200}
          placeholder={
            nickname ? `${nickname}으로 남기기...` : "닉네임 설정 후 작성 가능"
          }
          className="border-blossom-200 focus:border-blossom-400 flex-1 rounded-xl border bg-white px-3 py-2 text-sm transition-colors outline-none placeholder:text-gray-300"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
            content.trim()
              ? "bg-blossom-600 hover:bg-blossom-700 text-white"
              : "cursor-not-allowed bg-gray-100 text-gray-300"
          )}
        >
          <Send size={14} />
        </button>
      </form>

      {/* 댓글 목록 */}
      {loading ? (
        <p className="py-4 text-center text-xs text-gray-400">불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="py-6 text-center text-xs text-gray-400">
          첫 번째 현장 이야기를 남겨보세요 🌸
        </p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li
              key={c.id}
              className="border-blossom-100 rounded-xl border bg-white px-3 py-2.5"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-blossom-600 text-xs font-semibold">
                  {c.nickname}
                </span>
                <span className="text-xs text-gray-300">
                  {timeAgo(c.createdAt)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-700">
                {c.content}
              </p>
            </li>
          ))}
        </ul>
      )}

      {showNicknameModal && (
        <NicknameSetup
          current={nickname}
          onSave={(n) => {
            assign(n);
            setShowNicknameModal(false);
          }}
          onClose={() => setShowNicknameModal(false)}
        />
      )}
    </div>
  );
}
