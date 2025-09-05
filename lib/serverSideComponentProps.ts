export type ServerSideComponentProp = {
  params: Promise<{ id: string, view?: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}