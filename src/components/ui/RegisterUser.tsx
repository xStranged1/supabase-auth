import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import { z } from "zod"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react"
const formSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().min(2, {
      message: "email must be at least 2 characters.",
    }),
  })
   

export default function RegisterUser({session, supabase}){

  const [submited, setSubmited] = useState(false)

    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: session.user.user_metadata.fullname ? session.user.user_metadata.fullname : "" ,
      email: session.user.email ? session.user.email : "",
    },
  })
 
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const {username, email} = values
    let user = {
        username: username,
        email: email
    }
    async function createUser(){
        const { error } = await supabase
        .from('users')
        .insert(user)
        return error
    }
    const error = createUser()
    setSubmited(true)

  }


    return(
        <div className="w-72 mt-4 py-6 p-6 self-center justify-center rounded border-slate-200 border">
        <h2 className="font-semibold text-xl mb-4">Registrar usuario</h2>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormDescription>
                        This is your public display name.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                        <Input type="email" placeholder="email" {...field} />
                    </FormControl>
                    <FormDescription>
                        This is your public display email.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
            />
            <Button type="submit">Enviar</Button>
        </form>
        </Form>


          <AlertDialog open={submited} onOpenChange={setSubmited}>
            <AlertDialogTrigger></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle style={{color: "#008f39"}}>Usuario registrado correctamente!</AlertDialogTitle>
                <AlertDialogDescription>
                  Puede modificarlo mas tarde
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        

        
    </div>
    )
  }