"use client";
import { Organization } from "@/constants/organization";
import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function OrganizationSelect() {
  const searchParams = useSearchParams();
  const status = searchParams.get("organization") || "All";
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChange = (e: any) => {
    const params = new URLSearchParams(searchParams);

    if (e.target.value === "All") {
      params.delete("organization");
    } else {
      params.set("organization", e.target.value);
    }
    
    params.delete("page");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <FormControl>
      <Select
        variant="standard"
        label="organization"
        defaultValue={status}
        onChange={handleChange}
      >
        <MenuItem value={"All"}>Všechny</MenuItem>
        {Organization.getAllOrganizations().map((org) => (
          <MenuItem key={org.name} value={org.name}>{org.name}</MenuItem>
        ))}
      </Select>
      <FormHelperText>Organizace</FormHelperText>
    </FormControl>
  );
}
