import mysql from "mysql2/promise";

export async function getConnection() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    multipleStatements: true,
  });
}

export async function query<T extends any>({
  query,
  values = [],
}: {
  query: string;
  values?: any[];
}): Promise<T> {
  const connection = await getConnection();

  try {
    const [results] = await connection.query(query, values);
    await connection.end();
    return results as T
  } catch (error) {
    await connection.end();
    throw error;
  }
}
