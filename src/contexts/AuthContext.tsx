import { api } from "@/services/api"
import { createContext, useEffect, useState } from "react"

type AuthContext = {
  isLoading: boolean
  session: null | UserAPIResponse
  save: (data: UserAPIResponse) => void
  remove: () => void
}

const LOCAL_STORAGE_KEY = "@smart-order"

export const AuthContext = createContext({} as AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<null | UserAPIResponse>(null)
  const [isLoading, setIsLoading] = useState(true)

  function save(data: UserAPIResponse) {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}:user`, JSON.stringify(data.user))
    localStorage.setItem(`${LOCAL_STORAGE_KEY}:token`, data.token)

    api.defaults.headers.common.Authorization = `Bearer ${data.token}`

    setSession(data)
  }

  function remove() {
    setSession(null)

    localStorage.removeItem(`${LOCAL_STORAGE_KEY}:user`)
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}:token`)

    window.location.assign("/")
  }

  function loadUser() {
    const user = localStorage.getItem(`${LOCAL_STORAGE_KEY}:user`)
    const token = localStorage.getItem(`${LOCAL_STORAGE_KEY}:token`)

    if (user && token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`

      setSession({
        user: JSON.parse(user),
        token,
      })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <AuthContext.Provider value={{ session, isLoading, save, remove }}>
      {children}
    </AuthContext.Provider>
  )
}
