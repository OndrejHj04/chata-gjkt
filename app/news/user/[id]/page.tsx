import { getNewsList } from "@/api/news/index";
import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import { Accordion, AccordionDetails, Typography } from "@mui/material";
import NewsReadableSection from "./components/NewsReadableSection";
import { requireAuthServerSession } from "@/lib/authServerSession";

export default async function Page(props: ServerSideComponentProp) {
  const { id } = await props.params;
  const { data, count } = await getNewsList({ user: id, noReadOnly: false });
  const user = await requireAuthServerSession();

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
