import { query } from "@/lib/db";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";

export const getGroupList = async (
  searchParams: Awaited<ServerSideComponentProp["searchParams"]>
) => {
  const { page = "1", search, user } = searchParams;

  const [groups, count] = (await Promise.all([
    query({
      query: `
        SELECT groups.id, groups.name, description, 
        JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) AS owner, 
        GROUP_CONCAT(DISTINCT reservationId) AS reservations, GROUP_CONCAT(DISTINCT userId) AS users 
        FROM groups 
        LEFT JOIN users ON users.id = owner 
        LEFT JOIN users_groups ON users_groups.groupId = groups.id 
        LEFT JOIN reservations_groups ON reservations_groups.groupId = groups.id 
        LEFT JOIN reservations ON reservations.id = reservations_groups.groupId
        WHERE 1=1
        ${search ? `AND groups.name LIKE "%${search}%"` : ""}
        ${user ? `AND users_groups.userId = ${user}` : ''}
        GROUP BY groups.id
        LIMIT 10 OFFSET ${Number(page) * 10 - 10}
      `,
      values: [Number(page) * 10 - 10],
    }),
    query({
      query: `
        SELECT COUNT(*) as count FROM groups
        ${user ? `INNER JOIN users_groups ug ON ug.groupId = groups.id` : ''}
        WHERE 1=1
        ${search ? `AND groups.name LIKE "%${search}%"` : ""}
        ${user ? `AND ug.userId = ${user}` : ''}
      `,
      values: [],
    }),
  ])) as any;

  const data = groups.map((group: any) => {
    return {
      ...group,
      owner: JSON.parse(group.owner),
      users: group.users ? group.users.split(",").map(Number) : [],
    };
  });

  return { data: data, count: count[0].count };
};
