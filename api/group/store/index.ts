export const createNewGroup = async ({
  name,
  description,
  owner,
}: {
  name: any;
  description: any;
  owner: any;
}) => {
  const { insertId, affectedRows } = (await query({
    query: `INSERT INTO groups (name, description, owner) VALUES (?,?,?)`,
    values: [name, description, owner],
  })) as any;

  await query({
    query: `INSERT INTO users_groups (userId, groupId) VALUES ("${owner}", "${insertId}")`,
  });

  return { success: affectedRows === 1, id: insertId };
};
