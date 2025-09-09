"use server";

import { getAuthServerSession } from "@/lib/authServerSession";
import { query } from "@/lib/db";

export const getUserTheme = async () => {
  const user = await getAuthServerSession();
  if (!user) return 1;

  const [{ theme }] = (await query({
    query: `SELECT theme FROM users WHERE id = ?`,
    values: [user.id],
  })) as any;

  return theme;
};
