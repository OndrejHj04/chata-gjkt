import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";

export const getUserList = async ({
  page = 1,
  search,
  role,
  organization,
  verified,
  sort = "",
  dir = "",
}: {
  page: any;
  search: any;
  role: any;
  organization: any;
  verified: any;
  sort: any;
  dir: any;
}) => {
  const allowedSort = [
    "u.name",
    "u.email",
    "u.role",
    "u.organization",
    "u.verified",
  ];
  const { user } = (await getServerSession(authOptions)) as any;

  const [users, count] = (await Promise.all([
    query({
      query: `
SELECT 
    u.id, 
    CONCAT(u.first_name, ' ', u.last_name) AS name, 
    u.email, 
    u.verified, 
    r.name AS role_name, 
    r.id as role_id,
    u.image, 
    o.name AS organization_name,
    CASE WHEN ${user.role.id} IN (1, 2) OR u.id = ${
        user.id
      } THEN TRUE ELSE FALSE END AS detail,
    CASE WHEN u_child.id IS NULL THEN NULL
    ELSE GROUP_CONCAT(JSON_OBJECT('id', u_child.id, 'name', CONCAT(u_child.first_name, ' ', u_child.last_name), 'role', child_r.name, 'organization', child_o.name, 'role_id', child_r.id, 'detail', CASE WHEN ${
      user.role.id
    } IN (1, 2) OR u.id = ${
        user.id
      } THEN TRUE ELSE FALSE END) separator '|||') END as children
FROM users u
INNER JOIN roles r ON r.id = u.role
LEFT JOIN organization o ON o.id = u.organization
LEFT JOIN users u_child ON u.email = u_child.email AND u_child.children = 1
LEFT JOIN roles child_r ON child_r.id = u_child.role
LEFT JOIN organization child_o ON child_o.id = u_child.organization
WHERE u.children = 0
${
  search
    ? `AND CONCAT(u.first_name, ' ', u.last_name) LIKE "%${search}%"`
    : ""
}
${role ? `AND u.role = "${role}"` : ""}
${organization ? `AND u.organization = "${organization}"` : ""}
${verified ? `AND u.verified = ${verified}` : ""}

GROUP BY u.id
        ${
          dir !== "" && allowedSort.includes(sort)
            ? `ORDER BY ${sort} ${dir}`
            : ""
        }
LIMIT 10 OFFSET ?
        
      `,
      values: [page * 10 - 10],
    }),
    query({
      query: `SELECT COUNT(*) as count FROM users u
      INNER JOIN roles r ON r.id = u.role
      LEFT JOIN organization o ON o.id = u.organization
      WHERE u.children = 0
      ${
        search
          ? `AND CONCAT(u.first_name, ' ', u.last_name) LIKE "%${search}%"`
          : ""
      }
      ${role ? `AND u.role = "${role}"` : ""}
      ${organization ? `AND u.organization = "${organization}"` : ""}
      ${verified ? `AND u.verified = ${verified}` : ""}
      `,
      values: [],
    }),
  ])) as any;

  const data = users.map((user: any) => ({
    ...user,
    children: user.children
      ? user.children.split("|||").map((item: any) => JSON.parse(item))
      : [],
  }));

  return { data: data, count: count[0].count };
};
