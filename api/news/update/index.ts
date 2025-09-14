"use server";

import { query } from "@/lib/db";

export const updateNews = async ({ id, user }: { id: any; user: any }) => {
  const req = await query({
    query:
      "UPDATE user_news SET `read` = 1 WHERE user_news.userId = ? AND user_news.newsId = ?",
    values: [user, id],
  });
};
