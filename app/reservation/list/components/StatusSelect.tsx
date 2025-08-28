"use client";

import { Status } from "@/constants/status";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function StatusSelect() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || "All";
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);

    if (e.target.value === "All") {
      params.delete("status");
    } else {
      params.set("status", e.target.value);
    }

    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl>
      <Select
        variant="standard"
        label="Status rezervace"
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={"All"}>Všechny</MenuItem>
        {Status.getAllStatus().map((status) => (
          <MenuItem key={status.name} value={status.name}>
            {status.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Status rezervace</FormHelperText>
    </FormControl>
  );
}
