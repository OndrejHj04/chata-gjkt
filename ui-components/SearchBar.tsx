"use client";
import { TextField } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function SearchBar({ label }: { label: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const search = searchParams.get("search") || "";

  const makeSearch = (e: any) => {
    const params = new URLSearchParams(searchParams);

    if (e.target.value.length) params.set("search", e.target.value);
    else params.delete("search");

    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TextField
      variant="standard"
      className="md:w-80 w-32"
      label={label}
      defaultValue={search}
      onChange={makeSearch}
    />
  );
}
