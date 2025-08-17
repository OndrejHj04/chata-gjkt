"use client";

import { Visibility } from "@/constants/visibility";
import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function AlbumVisibilityFilterSelect({
  className,
}: {
  className?: any;
}) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "Všechny";
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);

    if (e.target.value === "Všechny") {
      params.delete("visibility");
    } else {
      params.set("visibility", e.target.value);
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl className={className}>
      <Select
        size="small"
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="standard"
        label="Přístupnost alba"
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={"Všechny"}>Všechny</MenuItem>
        {Visibility.getAllVisibilities().map((visibility) => (
          <MenuItem key={visibility.name} value={visibility.name}>{visibility.name}</MenuItem>
        ))}
      </Select>
      <FormHelperText>Přístupnost alba</FormHelperText>
    </FormControl>
  );
}
