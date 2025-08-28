"use client";
import { Role } from "@/constants/role";
import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function RolesSelect() {
  const searchParams = useSearchParams();
  const status = searchParams.get("role") || "All";
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);

    if (e.target.value === "All") {
      params.delete("role");
    } else {
      params.set("role", e.target.value);
    }

    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl>
      <Select
        variant="standard"
        label="role"
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={'All'}>Všechny</MenuItem>
        {Role.getAllRoles().map((role) => (
          <MenuItem key={role.name} value={role.name}>{role.name}</MenuItem>
        ))}
      </Select>
      <FormHelperText>Role</FormHelperText>
    </FormControl>
  );
}
