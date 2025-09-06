import { query } from "@/lib/db";

export const getGroupDetail = async (id: string) => {
  const req = (await query({
    query: `SELECT g.id, g.name, g.description, u.image as owner_image, CONCAT(u.first_name, ' ', u.last_name) as owner_name, u.email as owner_email FROM groups g INNER JOIN users u ON u.id = g.owner WHERE g.id = ?`,
    values: [id],
  })) as any;

  return req[0];
};
