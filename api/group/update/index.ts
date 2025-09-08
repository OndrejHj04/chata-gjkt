import { query } from "@/lib/db";

export const editGroupDetail = async ({
  groupId,
  name,
  description,
}: {
  groupId: any;
  name: any;
  description: any;
}) => {
  const req = (await query({
    query: `UPDATE groups set name = ?, description = ? WHERE groups.id = ?`,
    values: [name, description, groupId],
  })) as any;

  return { success: req.affectedRows === 1 };
};
