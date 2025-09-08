"use server";

import { getAuthServerSession } from "@/lib/authServerSession";
import { query } from "@/lib/db";

export const setTheme = async () => {
  const user = await getAuthServerSession();

  const req = (await query({
    query: `UPDATE users SET theme = 1 - theme WHERE id = ?`,
    values: [user.id],
  })) as any;
};
