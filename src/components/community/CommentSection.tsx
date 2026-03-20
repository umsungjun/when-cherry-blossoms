"use client";

import { FormEvent, useEffect, useState } from "react";

import { MessageCircle, RefreshCw } from "lucide-react";

import { ensureAuth } from "@/lib/firebase/auth";
import { addComment } from "@/lib/firebase/comments";
import { useComments } from "@/lib/hooks/useComments";
import { useNickname } from "@/lib/hooks/useNickname";
import { cn } from "@/lib/utils/cn";
import { generateNickname } from "@/lib/utils/nickname";
import { timeAgo } from "@/lib/utils/date";

interface Props {
  regionId: string;
}

export function CommentSection({ regionId }: Props) {
  const { comments, loading } = useComments(regionId);
  const { nickname, assign } = useNickname();
  const [nicknameInput, setNicknameInput] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 닉네임이 없으면 랜덤 생성해서 input에 세팅
  useEffect(() => {
    if (nickname) {
      setNicknameInput(nickname);
    } else {
      setNicknameInput(generateNickname());
    }
  }, [nickname]);

  const handleReroll = () => {
    setNicknameInput(generateNickname());
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !nicknameInput.trim()) return;

    // 닉네임이 변경되었으면 저장
    if (nicknameInput.trim() !== nickname) {
      assign(nicknameInput.trim());
    }

    setSubmitting(true);
    try {
      const uid = await ensureAuth();
      await addComment(regionId, nicknameInput.trim(), content.trim(), uid);
      setContent("");
    } catch {
      alert("댓글 등록에 실패했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-text-primary flex items-center gap-2 text-base font-bold">
        <MessageCircle size={16} className="text-[#ff4da6]" />
        현장 이야기 ({comments.length})
      </h3>

      {/* 인라인 작성 카드 */}
      <form
        onSubmit={handleSubmit}
        className="bg-sakura-900 space-y-3 rounded-xl border border-[rgba(255,77,166,0.15)] p-4"
      >
        {/* 닉네임 입력 */}
        <div className="flex items-center gap-2">
          <input
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            maxLength={16}
            placeholder="닉네임"
            className="bg-sakura-950 text-text-primary placeholder:text-text-faint flex-1 rounded-lg border border-[rgba(255,77,166,0.2)] px-3 py-2 text-sm outline-none transition-colors focus:border-[#ff4da6]"
          />
          <button
            type="button"
            onClick={handleReroll}
            title="랜덤 닉네임"
            className="text-text-muted rounded-lg border border-[rgba(255,77,166,0.2)] p-2 transition-colors hover:border-[#ff4da6] hover:text-[#ff4da6]"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        {/* 메시지 입력 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="현장 이야기를 남겨보세요..."
          className="bg-sakura-950 text-text-primary placeholder:text-text-faint w-full resize-none rounded-lg border border-[rgba(255,77,166,0.2)] px-3 py-2 text-sm outline-none transition-colors focus:border-[#ff4da6]"
        />

        {/* 하단: 글자 수 + 전송 버튼 */}
        <div className="flex items-center justify-between">
          <span className="text-text-faint text-xs">
            {content.length}/500
          </span>
          <button
            type="submit"
            disabled={submitting || !content.trim() || !nicknameInput.trim()}
            className={cn(
              "rounded-xl px-5 py-2 text-sm font-semibold transition-all",
              content.trim() && nicknameInput.trim()
                ? "bg-[#ff4da6] text-white hover:bg-[#e0358a]"
                : "bg-sakura-800 text-text-faint cursor-not-allowed"
            )}
          >
            남기기
          </button>
        </div>
      </form>

      {/* 댓글 목록 */}
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
    </div>
  );
}
