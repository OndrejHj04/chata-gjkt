import mysql from "mysql2/promise";

export async function getConnection(){
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    multipleStatements: true
  });
}

export async function query({
  query,
  values = [],
}: {
  query: string;
  values?: any[];
}) {
  const connection = await getConnection()

  try {
    const [results] = await connection.query(query, values);
    connection.end()
    return results;
  } catch (error: any) {
    throw Error(error.message);
  }
}
