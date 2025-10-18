import { Route, Routes } from "react-router"

import { SignIn } from "../pages/Signin"
import { SignUp } from "@/pages/Signup"
import { NotFound } from "@/pages/NotFound"

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
