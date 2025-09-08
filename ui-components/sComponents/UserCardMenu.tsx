import React from "react";
import { Button, Typography } from "@mui/material";
import Link from "next/link";
import AvatarWrapper from "@/ui-components/AvatarWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function TopBarUserCard() {
  const data = await getServerSession(authOptions);
  if (!data?.user) return null;

  return (
    <div className="flex">
      <Button component={Link} href={`/user/detail/${data.user.id}/info`}>
        <div className="flex-col mx-4 items-end normal-case text-white sm:flex hidden">
          <Typography className="!font-semibold" variant="body1">
            {data.user.first_name} {data.user.last_name}
          </Typography>
          <div className="flex gap-1 items-center">
            <Typography variant="body2">{data.user.role}</Typography>
          </div>
        </div>
        <AvatarWrapper data={data.user} />
      </Button>
    </div>
  );
}
