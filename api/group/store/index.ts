"use server";
import { requireAuthServerSession } from "@/lib/authServerSession";
import { query } from "@/lib/db";

export const createNewGroup = async ({
  name,
  description,
}: {
  name: any;
  description: any;
}) => {
  const user = await requireAuthServerSession();

  const { insertId, affectedRows } = (await query({
    query: `INSERT INTO groups (name, description, owner) VALUES (?,?,?)`,
    values: [name, description, user.id],
  })) as any;

  await query({
    query: `INSERT INTO users_groups (userId, groupId) VALUES (?,?)`,
    values: [user.id, insertId],
  });

  return { success: affectedRows === 1, id: insertId };
};
