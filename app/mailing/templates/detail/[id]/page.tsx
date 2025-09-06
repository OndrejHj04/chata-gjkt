import { ServerSideComponentProp } from "@/lib/serverSideComponentProps";
import TemplateForm from "./TemplateForm";
import { malingTemplateDetail } from "@/lib/api";

export default async function TemplateDetail(props: ServerSideComponentProp) {
  const { id } = await props.params;
  
  const template = await malingTemplateDetail({ id });

  return <TemplateForm template={template} />;
}
