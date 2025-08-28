"use client";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const options = [
  { name: "Běží", value: 1 },
  { name: "Nespuštěná", value: 0 },
];

export default function RegistrationState() {
  const searchParams = useSearchParams();
  const status = searchParams.get("registration") || "All";
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);

    if (e.target.value === "All") {
      params.delete("registration");
    } else {
      params.set("registration", e.target.value);
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
        <MenuItem value={'All'}>Vše</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.name} value={option.value}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Stav registrace</FormHelperText>
    </FormControl>
  );
}
