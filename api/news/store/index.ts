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

  const req = await query({
    query: `INSERT INTO news (title, content, author) VALUES (?,?,?)`,
    values: [data.title, data.content, user.id],
  });

  return { success: true };
};
