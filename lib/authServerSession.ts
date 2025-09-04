import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export const getAuthServerSession = async () => {
  const data = await getServerSession(authOptions);

  if (!data) throw new Error("No active session found");

  return data?.user;
};
