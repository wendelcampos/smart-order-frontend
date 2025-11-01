import { Route, Routes } from "react-router"

import { Layout } from "@/components/layout"

import { Dashboard } from "@/pages/Dashboard"
import { NotFound } from "@/pages/NotFound"
import { Tables } from "@/pages/Tables"
import { Waiters } from "@/pages/Waiters"
import { Products } from "@/pages/Products"
import { Satisfaction } from "@/pages/satisfaction"
import { Orders } from "@/pages/Orders"
import { Payments } from "@/pages/Payments"
import { Customers } from "@/pages/Customers"
import { Users } from "@/pages/Users"

export function ManagerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tables" element={<Tables />} />
        <Route path="waiters" element={<Waiters />} />
        <Route path="products" element={<Products />} />
        <Route path="satisfaction" element={<Satisfaction />} />
        <Route path="payments" element={<Payments />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
