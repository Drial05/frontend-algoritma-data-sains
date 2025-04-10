"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CalendarIcon, MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
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
      const [open, setOpen] = useState(false);
      const [loading, setLoading] = useState(false);
      const [editOpen, setEditOpen] = useState(false);
      const [editData, setEditData] = useState({
        nama: customer.nama,
        jenis_kelamin: customer.jenis_kelamin,
        umur: customer.umur,
        frekuensi: customer.frekuensi,
        pengeluaran: customer.pengeluaran,
        total_transaksi: customer.total_transaksi,
        rata_pengeluaran: customer.rata_pengeluaran,
        terakhir_transaksi: new Date(customer.terakhir_transaksi),
      });
      const router = useRouter();

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        const newValue = type === "number" ? Number(value) : value;
        setEditData((prev) => ({
          ...prev,
          [name]: newValue,
        }));
      };

      const toLocalDateString = (date: Date) => {
        const timezoneOffset = date.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = new Date(
          date.getTime() - timezoneOffset
        ).toISOString();
        return localISOTime.split("T")[0];
      };

      // Edit
      const handleEdit = async () => {
        setLoading(true);
        const token = getCookie("token");

        try {
          const res = await fetch(
            `http://localhost:3000/customers/update-customer/${customer.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...editData,
                terakhir_transaksi: toLocalDateString(
                  editData.terakhir_transaksi
                ),
              }),
            }
          );

          if (res.ok) {
            router.refresh();
            setEditOpen(false);
          } else {
            const error = await res.json();
            console.error("Gagal mengupdate data customer", error);
          }
        } catch (err) {
          console.error("Error", err);
        } finally {
          setLoading(false);
        }
      };

      // Delete
      const handleDelete = async () => {
        setLoading(true);
        const token = getCookie("token");
        try {
          const res = await fetch(
            `http://localhost:3000/customers/delete-customer/${customer.id}`,
            {
              method: "DELETE",
              headers: {
                "Conetent-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("res", res);
          if (res.ok) {
            router.refresh();
            setOpen(false);
          } else {
            console.error("Gagal menghapus data customer");
          }
        } catch (err) {
          console.error("Error", err);
        } finally {
          setLoading(false);
        }
      };

      return (
        <>
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
              <DropdownMenuItem
                onClick={() => {
                  setEditData({
                    nama: customer.nama,
                    umur: customer.umur,
                    jenis_kelamin: customer.jenis_kelamin,
                    pengeluaran: customer.pengeluaran,
                    frekuensi: customer.frekuensi,
                    total_transaksi: customer.total_transaksi,
                    rata_pengeluaran: customer.rata_pengeluaran,
                    terakhir_transaksi: new Date(customer.terakhir_transaksi),
                  });
                  setEditOpen(true);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog edit*/}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="md:max-w-[600px] sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Edit customer</DialogTitle>
                <DialogDescription>
                  Edit customer disini, klik tombol update jika sudah.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:mb-5">
                <div className="w-full">
                  <Label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Nama
                  </Label>
                  <Input
                    id="nama"
                    type="text"
                    name="nama"
                    value={editData.nama}
                    onChange={(e) =>
                      setEditData({ ...editData, nama: e.target.value })
                    }
                    placeholder="Edit nama customer"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="Umur"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Umur
                  </label>
                  <Input
                    type="number"
                    name="umur"
                    value={editData.umur}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        umur: parseInt(e.target.value),
                      })
                    }
                    id="umur"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Edit umur customer"
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="brand"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Jenis Kelamin
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setEditData((prev) => ({ ...prev, jenis_kelamin: value }))
                    }
                    value={editData.jenis_kelamin}
                  >
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="L">Laki-Laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full">
                  <label
                    htmlFor="brand"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Pengeluaran
                  </label>
                  <Input
                    type="number"
                    name="pengeluaran"
                    id="pengeluaran"
                    value={editData.pengeluaran}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        pengeluaran: parseInt(e.target.value),
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Edit pengeluaran customer"
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="brand"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Frekuensi
                  </label>
                  <Input
                    type="number"
                    name="frekuensi"
                    id="frekuensi"
                    value={editData.frekuensi}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        frekuensi: parseInt(e.target.value),
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Edit frekuensi customer"
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="brand"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Total Transaksi
                  </label>
                  <Input
                    type="number"
                    name="total_transaksi"
                    id="total_transaksi"
                    value={editData.total_transaksi}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        total_transaksi: parseInt(e.target.value),
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Edit total transaksi customer"
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="rata_pengeluaran"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Rata Pengeluaran
                  </label>
                  <Input
                    type="number"
                    name="rata_pengeluaran"
                    id="rata_pengeluaran"
                    value={editData.rata_pengeluaran}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        rata_pengeluaran: parseInt(e.target.value),
                      })
                    }
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Edit rata pengeluaran customer"
                    required
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="terakhir_transaksi"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Terakhir Transaksi
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !editData.terakhir_transaksi &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editData.terakhir_transaksi ? (
                          format(editData.terakhir_transaksi, "PPP")
                        ) : (
                          <span>Terakhir Transaksi</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Calendar
                        mode="single"
                        selected={
                          editData.terakhir_transaksi
                            ? new Date(editData.terakhir_transaksi)
                            : undefined
                        }
                        onSelect={(selectedDate) =>
                          selectedDate &&
                          setEditData((prev) => ({
                            ...prev,
                            terakhir_transaksi: selectedDate,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleEdit} disabled={loading}>
                  {loading ? "Loading..." : "Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Dialog delete */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>Hapus Customer</DialogHeader>
              <DialogTitle>
                Apakah kamu yakin ingin menghapus <b>{customer.nama}</b>?
              </DialogTitle>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Batal
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Menghapus..." : "Hapus"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
