import { requireAuthServerSession } from "@/lib/authServerSession";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";

export const getGroupDetail = async (id: string) => {
  const user = await requireAuthServerSession();

  const req = (await query({
    query: `SELECT g.id, g.name, g.description, JSON_OBJECT('id', u.id, 'name', CONCAT(u.first_name, ' ', u.last_name), 'image', u.image, 'email', u.email) as owner,
    CASE WHEN ug.userId IS NOT NULL THEN 1 ELSE 0 END AS is_member 
    FROM groups g 
    INNER JOIN users u ON u.id = g.owner 
    LEFT JOIN users_groups ug ON ug.groupId = g.id AND ug.userId = ?
    WHERE g.id = ?
    `,
    values: [user.id, id],
  })) as any;

  if (!req[0]) redirect("/");

  const data = {
    ...req[0],
    owner: JSON.parse(req[0].owner),
  };

  if (
    user.role === "uživatel" &&
    user.id !== data.owner.id &&
    !data.is_member
  )
    redirect("/");

  return data;
};
