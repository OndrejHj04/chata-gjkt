import { query } from "@/lib/db";

export const getNewsList = async (searchParams: any) => {
  const { page = "1", user, noReadOnly = true } = searchParams;

  const [data, count] = (await Promise.all([
    query({
      query: `
SELECT 
  n.id, 
  n.title, 
  n.content, 
  n.created_at, 
  un.read,
  CONCAT(u.first_name, ' ', u.last_name) AS author_name,
  CONCAT(
    CAST(SUM(un.read = 1) AS CHAR),
    '/',
    CAST(COUNT(un.newsId) AS CHAR)
  ) AS viewed
FROM news n
INNER JOIN users u ON n.author = u.id
LEFT JOIN user_news un ON un.newsId = n.id
${
  user ? `WHERE un.userId = ${user} ${noReadOnly ? "AND un.read = 0" : ""}` : ""
}
GROUP BY n.id, n.title, n.content, n.created_at, u.first_name, u.last_name
ORDER BY n.created_at DESC
LIMIT 10 OFFSET ?
      `,
      values: [Number(page) * 10 - 10],
    }),
    query({
      query: `
SELECT COUNT(DISTINCT n.id) AS count
FROM news n
INNER JOIN users u ON n.author = u.id
LEFT JOIN user_news un ON un.newsId = n.id
${
  user ? `WHERE un.userId = ${user} ${noReadOnly ? "AND un.read = 0" : ""}` : ""
};
      `,
      values: [],
    }),
  ])) as any;

  return { data: data, count: count[0].count };
};
