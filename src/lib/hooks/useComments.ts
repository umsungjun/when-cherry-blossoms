"use client";

import { useEffect, useState } from "react";

import { subscribeComments } from "@/lib/firebase/comments";
import { Comment } from "@/types/community";

export function useComments(regionId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeComments(regionId, (data) => {
      setComments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [regionId]);

  return { comments, loading };
}
