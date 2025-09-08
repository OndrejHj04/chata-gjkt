import { query } from "@/lib/db";

export const groupDelete = async (id: any) => {
  const request = (await query({
    query: `DELETE FROM groups WHERE groups.id = ?`,
    values: [id],
  })) as any;

  return { success: request.affectedRows === 1 };
};
