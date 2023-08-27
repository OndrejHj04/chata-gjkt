import { Avatar, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

const getUserData = async (id) => {
  const req = await fetch(`http://localhost:3000/api/getuserdata?id=${id}`, {
    cache: "no-cache",
    method: "GET",
  });

  return req.json();
};

export default async function Profile({ params: { id } }) {
  const { data } = await getUserData(id);
  if (!data) {
    return <Typography variant="h4">User not found</Typography>;
  }
  console.log(data);
  return (
    <div className="p-5 flex items-center gap-2">
      <Avatar sx={{ width: 60, height: 60 }} src={data.photo} />
      <Typography variant="h4">Jméno: {data.full_name}</Typography>
    </div>
  );
}
