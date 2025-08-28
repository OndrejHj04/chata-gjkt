"use client";
import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function TableFilterSelect({
  name,
  label,
  options,
}: {
  name: string;
  options: { name: string, value?: number }[];
  label: string
}) {
  const searchParams = useSearchParams();
  const status = searchParams.get(name) || "All";
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);

    if (e.target.value === "All") {
      params.delete(name);
    } else {
      params.set(name, e.target.value);
    }

    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl>
      <Select
        variant="standard"
        label={name}
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={"All"}>Všechny</MenuItem>
        {options.map((role) => (
          <MenuItem key={role.name} value={role.value !== undefined ? role.value : role.name}>
            {role.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{label}</FormHelperText>
    </FormControl>
  );
}
