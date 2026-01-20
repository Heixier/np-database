"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Post } from "@/types/tables";

export const columns: ColumnDef<Post>[] = [
  {
    accessorKey: "user",
    header: "Author",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "content",
    header: "Content",
  },
];
