import { getNewsList } from "@/api/news/index";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { Accordion, AccordionDetails, Typography } from "@mui/material";
import NewsReadableSection from "./components/NewsReadableSection";
import { requireAuthServerSession } from "@/lib/authServerSession";
import { redirect } from "next/navigation";

export default async function Page(props: ServerSideComponentProp) {
  const { id } = await props.params;
  const user = await requireAuthServerSession();
  if (user.id.toString() !== id) redirect("/");

  const { data, count } = await getNewsList({ user: id, noReadOnly: false });

  return (
    <>
      <Typography variant="h5">Vaše oznámení</Typography>
      {data.map((item) => (
        <Accordion key={item.id}>
          <NewsReadableSection item={item} user={user.id} />
          <AccordionDetails>
            <Typography>Autor: {item.author_name}</Typography>
            <Typography>{item.content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
