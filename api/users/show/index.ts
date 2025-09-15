import { query } from "@/lib/db";

export const getUserDetail = async (id: string) => {
  const req = (await query({
    query: `SELECT u.id, CONCAT(u.first_name, ' ', u.last_name) as name, u.image, u.email, r.name as role, u.verified, u.adress, u.birth_date, u.ID_code, o.id as organization_id, o.name as organization_name, parent.id as parent_id, CONCAT(parent.first_name, ' ', parent.last_name) as parent_name, COUNT(ch.id) as children
    FROM users u 
    INNER JOIN roles r ON r.id = u.role
    LEFT JOIN users parent ON parent.email = u.email AND parent.id <> u.id AND parent.children = 0
    LEFT JOIN users ch ON ch.email = u.email AND ch.id <> u.id AND ch.children = 1 AND u.children <> 1
    LEFT JOIN organization o ON o.id = u.organization
    WHERE u.id = ?
    GROUP BY u.id
    `,
    values: [id],
  })) as any[];

  return req[0];
};
