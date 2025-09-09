import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export const getAuthServerSession = async () => {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
};

export const requireAuthServerSession = async () => {
  const user = await getAuthServerSession();
  if (!user) throw new Error("No active session found");
  return user;
};
