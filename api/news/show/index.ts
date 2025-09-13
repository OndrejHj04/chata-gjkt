"use server";
import { query } from "@/lib/db";

export const showNotification = async (id: any) => {
  const res = (await query({
    query: `
    SELECT n.title, n.content, n.created_at,
    GROUP_CONCAT(
        CASE WHEN u2.id IS NOT NULL 
            THEN JSON_OBJECT('id', u2.id, 'name', CONCAT(u2.first_name, ' ', u2.last_name), 'email', u2.email, 'image', u2.image, 'read', un.updated_at) 
        END
    ) AS user_read
    FROM news n INNER JOIN users u ON n.author = u.id
    LEFT JOIN user_news un ON un.newsId = n.id AND un.read = 1
    LEFT JOIN users u2 ON u2.id = un.userId WHERE n.id = ? GROUP BY n.id;
    `,
    values: [id],
  })) as any;

  const data = {
    ...res[0],
    user_read: res[0].user_read ? JSON.parse(`[${res[0].user_read}]`) : [],
  };
  return data;
};
