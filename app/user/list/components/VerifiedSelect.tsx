"use client";

import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const verifiedOptions = [
  { name: "Pouze ověření", value: 1 },
  { name: "Pouze neověření", value: 0 },
];

export default function VerifiedSelect() {
  const searchParams = useSearchParams();
  const status = searchParams.get("verified") || "All";
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);

    if (e.target.value === "All") {
      params.delete("verified");
    } else {
      params.set("verified", e.target.value);
    }

    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl>
      <Select
        variant="standard"
        label="verified"
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={'All'}>Všechny</MenuItem>
        {verifiedOptions.map((option) => (
          <MenuItem key={option.name} value={option.value}>{option.name}</MenuItem>
        ))}
      </Select>
      <FormHelperText>Ověření</FormHelperText>
    </FormControl>
  );
}
