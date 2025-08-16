"use client";

import { Status } from "@/constants/status";
import {
  FormControl,
  FormHelperText,
  Icon,
  MenuItem,
  Select,
} from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function StatusSelect({ className }: { className?: any }) {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || 'Všechny'
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", e.target.value);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl className={className}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        variant="standard"
        label="Status rezervace"
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={'Všechny'}>Všechny</MenuItem>
        {Status.getAllStatus().map((status) => (
          <MenuItem key={status.name} value={status.name} className="gap-2">
            <Icon sx={{ "&&": { color: status.color } }}>{status.icon}</Icon>
            {status.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>Status rezervace</FormHelperText>
    </FormControl>
  );
}
