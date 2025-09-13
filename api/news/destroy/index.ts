"use server";

import { query } from "@/lib/db";

export default async function DestroyNotificaion(id: any) {
  const request = (await query({
    query: `DELETE FROM news WHERE news.id = ?`,
    values: [id],
  })) as any;

  return { success: request.affectedRows === 1 };
}
