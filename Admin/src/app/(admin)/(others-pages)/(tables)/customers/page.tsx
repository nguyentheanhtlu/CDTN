'use client'

import ApiCustomer from "@/api/customers";
import { CustomerTable } from "@/components/tables/BasicTableOne";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";

// export const metadata: Metadata = {
//   title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
//   description:
//     "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
//   // other metadata
// };

export default function BasicTables() {

  const [customers, setCustomers] = useState([])

  useEffect(() => {
    getCustomers()
  }, []);

  const getCustomers = async () => {
    const res = await ApiCustomer.getCustomers()
    setCustomers(res.data)
  }

  console.log(customers)
  return (
    <div>
      <div className="space-y-6">
        <CustomerTable customers={customers} />
      </div>
    </div>
  );
}
