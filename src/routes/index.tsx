import { BrowserRouter } from "react-router"

import { Loading } from "@/components/loading"

import { AuthRoutes } from "./AuthRoutes"
import { ManagerRoutes } from "./ManagerRoutes"
import { useAuth } from "@/hooks/useAuth"

export function Routes() {
  const { session, isLoading } = useAuth()

  function Route() {
    switch (session?.user.role) {
      case "admin":
        return <ManagerRoutes />
      case "user":
        return <ManagerRoutes />
      default:
        return <AuthRoutes />
    }
  }

  if (isLoading) {
    return <Loading />
  }
  return (
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  )
}
