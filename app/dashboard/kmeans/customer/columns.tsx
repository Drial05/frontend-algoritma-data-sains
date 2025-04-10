"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Customer = {
  id: number;
  nama: string;
  umur: number;
  pengeluaran: number;
  jenis_kelamin: string;
  frekuensi: number;
  terakhir_transaksi: string;
  total_transaksi: number;
  rata_pengeluaran: number;
};

export const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "nama",
    header: ({ column }) => {
      return (
        <div className="text-center font-medium">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const nama = row.getValue("nama");
      return <div className="text-center font-medium">{nama as string}</div>;
    },
  },
  {
    accessorKey: "jenis_kelamin",
    header: "Gender",
  },
  {
    accessorKey: "umur",
    header: "Age",
  },
  {
    accessorKey: "frekuensi",
    header: "Frekuensi",
  },

  {
    accessorKey: "pengeluaran",
    header: () => <div className="text-center">Pengeluaran</div>,
    cell: ({ row }) => {
      const spending = parseFloat(row.getValue("pengeluaran") as string);
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(spending);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "total_transaksi",
    header: "Total Transaksi",
  },
  {
    accessorKey: "rata_pengeluaran",
    header: "Rata Pengeluaran",
  },
  {
    accessorKey: "terakhir_transaksi",
    header: "Pembelian Terakhir",
    cell: ({ row }) => {
      const rowDate = row.getValue("terakhir_transaksi") as string;
      return new Date(rowDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-center">
              <Button variant="ghost" className="h-8 w-8 p-4">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.nama)}
            >
              Copy Name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
