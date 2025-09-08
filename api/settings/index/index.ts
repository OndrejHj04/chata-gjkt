import { query } from "@/lib/db";

export const getSettings = async () => {
  const data = (await query({
    query: `
      SELECT * FROM settings s`,
    values: [],
  })) as any;

  return data[0];
};
