import logo from "../assets/logo.jpg"
import { useForm } from "react-hook-form"
import { z, ZodError } from "zod"
import { AxiosError } from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, Link } from "react-router"

import { api } from "@/services/api"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const signUpSchema = z
  .object({
    name: z.string().min(1, { message: "Informe o nome." }),
    email: z.string().email({ message: "E-mail inválido." }),
    password: z
      .string()
      .min(6, { message: "Senha deve ter no mínimo 6 caracteres." }),
    passwordConfirm: z.string({ message: "As senhas não são iguais." }),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não são iguais.",
    path: ["passwordConfirm"],
  })

export function SignUp() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  })

  const navigate = useNavigate()

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    try {
      await api.post("/users", data)

      if (confirm("Cadastrado com sucesso. Ir para tela de entrar ?")) {
        navigate("/")
      }
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        return alert(error.issues[0].message)
      }

      if (error instanceof AxiosError) {
        return alert(error.response?.data.message)
      }

      alert("Não foi possivel cadastrar!")
    }
  }

  return (
    <div className="flex h-screen">
      <div className="bg-black h-screen w-3/5 flex justify-center items-center">
        <img src={logo} alt="" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-white">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-80 flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email@mail.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 rounded-2xl"
            >
              Cadastrar
            </Button>

            <Link
              to="/"
              className="text-sm font-semibold text-black mt-10 mb-4 text-center hover:text-orange-400 transition ease-linear"
            >
              Já tenho uma conta
            </Link>
          </form>
        </Form>
      </div>
    </div>
  )
}
