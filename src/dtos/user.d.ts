type UserAPIRole = "admin" | "user"

type UserAPIResponse = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: UserAPIRole
  }
}

type UserResponse = {
  id: string
  name: string
  email: string
  role: UserAPIRole
}

