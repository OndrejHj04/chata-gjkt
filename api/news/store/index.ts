"use server";
import { requireAuthServerSession } from "@/lib/authServerSession";
import { query } from "@/lib/db";

type NewsFormType = {
  title: string;
  content: string;
  send_email: boolean;
};

export const storeNews = async (data: NewsFormType) => {
  const user = await requireAuthServerSession();

  const { insertId } = await query({
    query: `INSERT INTO news (title, content, author) VALUES (?,?,?)`,
    values: [data.title, data.content, user.id],
  });

  await query({
    query: `
    INSERT INTO user_news (userId, newsId)
    SELECT u.id, ?
    FROM users u
    WHERE u.role <> 'veřejnost';
    `,
    values: [insertId],
  });

  return { success: true };
};
