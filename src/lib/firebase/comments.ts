import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { Comment } from "@/types/community";

import { getDb } from "./config";

const commentsRef = (regionId: string) =>
  collection(getDb(), "regions", regionId, "comments");

/** 댓글 실시간 구독 */
export function subscribeComments(
  regionId: string,
  callback: (comments: Comment[]) => void
) {
  const q = query(
    commentsRef(regionId),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  return onSnapshot(q, (snap) => {
    const comments: Comment[] = snap.docs.map((doc) => ({
      id: doc.id,
      regionId,
      nickname: doc.data().nickname ?? "익명",
      content: doc.data().content ?? "",
      createdAt: doc.data().createdAt?.toMillis() ?? Date.now(),
      uid: doc.data().uid ?? "",
    }));
    callback(comments);
  });
}

/** 댓글 작성 */
export async function addComment(
  regionId: string,
  nickname: string,
  content: string,
  uid: string
): Promise<void> {
  if (!content.trim() || content.length > 200) return;

  await addDoc(commentsRef(regionId), {
    nickname,
    content: content.trim(),
    uid,
    createdAt: serverTimestamp(),
  });
}

/** 최근 24h 댓글 수 (추천 스코어용) */
export async function getRecentCommentCount(regionId: string): Promise<number> {
  const since = new Date(Date.now() - 86400000);
  const q = query(
    commentsRef(regionId),
    orderBy("createdAt", "desc"),
    limit(30)
  );
  const snap = await getDocs(q);
  return snap.docs.filter((d) => {
    const ts = d.data().createdAt?.toMillis();
    return ts && ts > since.getTime();
  }).length;
}
