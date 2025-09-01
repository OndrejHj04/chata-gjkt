export type ServerSideComponentProp = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}