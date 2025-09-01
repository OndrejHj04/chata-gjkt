"use client";
import { TableCell, TablePagination } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TableListPagination({ count }: { count: number }) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const { replace } = useRouter();
  const pathname = usePathname();

  const pageChange = (_: any, newPage: any) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage + 1);
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <TableCell padding="none">
      <TablePagination
        className="[&_.MuiToolbar-root]:!min-h-[40px]"
        component="div"
        count={count}
        page={page - 1}
        onPageChange={pageChange}
        rowsPerPage={10}
        rowsPerPageOptions={[]}
        onRowsPerPageChange={() => {}}
      />
    </TableCell>
  );
}
