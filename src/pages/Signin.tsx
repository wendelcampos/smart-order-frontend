import logo from "../assets/logo.jpg"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z, ZodError } from "zod"

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
import { AxiosError } from "axios"
import { useAuth } from "@/hooks/useAuth"

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(1, { message: "Informe a senha" }).trim(),
})

export function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const auth = useAuth()

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await api.post("/sessions", data)

      auth.save(response.data)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        return { message: error.issues[0].message }
      }

      if (error instanceof AxiosError) {
        return { message: error.response?.data.message }
      }
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

            <Button
              type="submit"
              className="w-full bg-black hover:bg-gray-800 rounded-2xl"
            >
              Entrar
            </Button>

            <a
              href="/signup"
              className="text-sm font-semibold text-black mt-10 mb-4 text-center hover:text-orange-400 transition ease-linear"
            >
              Criar conta
            </a>
          </form>
        </Form>
      </div>
    </div>
  )
}
