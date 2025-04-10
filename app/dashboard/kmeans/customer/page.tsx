"use client";

import useSWR from "swr";
import { use, useEffect, useState } from "react";
import { Customer, columns } from "./columns";
import { DataTable } from "./data-table";
import { getCookie } from "cookies-next";

const fetcher = async (url: string) => {
  const token = getCookie("token");
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Gagal fetch data customers");
  }

  return res.json();
};

export default function CustomerPage() {
  const { data, error, isLoading } = useSWR<Customer[]>(
    "http://localhost:3000/customers",
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  if (isLoading) return <p className="p-4">Loading data...</p>;
  if (error) return <p className="p-4 text-red-500">Error mengambil data</p>;

  return (
    <div className="container mx-auto py-2 px-2">
      <DataTable columns={columns} data={data || []} />
    </div>
  );
}
