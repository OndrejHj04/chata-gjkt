import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, {params}:any) {
  const { user } = await req.json();

  const data = (await query({
    query: `SELECT pa.name FROM photogallery_albums pa 
    WHERE pa.name = ? AND (? != 3 OR pa.owner = ?)`,
    values: [decodeURIComponent(params.name), user.role.id, user.id],
  })) as any;

  return NextResponse.json({ exists: Boolean(data.length) });
}
