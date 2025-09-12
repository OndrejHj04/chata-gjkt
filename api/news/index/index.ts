import { query } from "@/lib/db";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";

export const getNewsList = async (
  searchParams: Awaited<ServerSideComponentProp["searchParams"]>
) => {
  const { page = "1" } = searchParams;

  const [data, count] = (await Promise.all([
    query({
      query: `
SELECT 
  n.id, 
  n.title, 
  n.content, 
  n.created_at, 
  CONCAT(u.first_name, ' ', u.last_name) AS author_name,
  CONCAT(
    CAST(SUM(un.read = 1) AS CHAR),
    '/',
    CAST(COUNT(un.newsId) AS CHAR)
  ) AS viewed
FROM news n
INNER JOIN users u ON n.author = u.id
LEFT JOIN user_news un ON un.newsId = n.id
GROUP BY n.id, n.title, n.content, n.created_at, u.first_name, u.last_name
LIMIT 10 OFFSET ?;
      `,
      values: [Number(page) * 10 - 10],
    }),
    query({
      query: `
      SELECT COUNT(*) as count FROM news`,
      values: [],
    }),
  ])) as any;

  return { data: data, count: count[0].count };
};
