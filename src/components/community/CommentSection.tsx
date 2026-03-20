"use client";

import { FormEvent, useState } from "react";

import { MessageCircle, Send } from "lucide-react";

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
        <h3 className="text-text-primary flex items-center gap-2 text-base font-bold">
          <MessageCircle size={16} className="text-[#ff4da6]" />
          현장 이야기 ({comments.length})
        </h3>
        {nickname && (
          <button
            onClick={() => setShowNicknameModal(true)}
            className="text-text-muted text-xs transition-colors hover:text-[#ff4da6]"
          >
            {nickname} ✏️
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={200}
          placeholder={
            nickname ? `${nickname}으로 남기기...` : "닉네임 설정 후 작성 가능"
          }
          className="bg-sakura-900 text-text-primary placeholder:text-text-faint flex-1 rounded-xl border border-[rgba(255,77,166,0.2)] px-3 py-2 text-sm transition-colors outline-none focus:border-[#ff4da6]"
        />
        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all",
            content.trim()
              ? "bg-[#ff4da6] text-white hover:bg-[#e0358a]"
              : "bg-sakura-800 text-text-faint cursor-not-allowed"
          )}
        >
          <Send size={14} />
        </button>
      </form>

      {loading ? (
        <p className="text-text-muted py-4 text-center text-xs">
          불러오는 중...
        </p>
      ) : comments.length === 0 ? (
        <p className="text-text-muted py-6 text-center text-xs">
          첫 번째 현장 이야기를 남겨보세요
        </p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li
              key={c.id}
              className="bg-sakura-900 rounded-xl border border-[rgba(255,77,166,0.15)] px-3 py-2.5"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-accent-light text-xs font-semibold">
                  {c.nickname}
                </span>
                <span className="text-text-faint text-xs">
                  {timeAgo(c.createdAt)}
                </span>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
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
