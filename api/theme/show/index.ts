"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { query } from "@/lib/db";
import { getServerSession } from "next-auth";

export const getUserTheme = async () => {
  const user = (await getServerSession(authOptions)) as any;
  if (!user) return 1;

  const [{ theme }] = (await query({
    query: `SELECT theme FROM users WHERE id = ?`,
    values: [user.user.id],
  })) as any;

  return theme;
};
