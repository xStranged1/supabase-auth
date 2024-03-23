import { useEffect, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { log } from "console";
 
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "email must be at least 2 characters.",
  }),
})
 
export default function Home({session, supabase}) {


    const [loading, setLoading] = useState(true)
    
    const [users, setUsers] = useState([])
    const [existMyUser, setExistMyUser] = useState(false)
    const [erorUser, setErrorUser] = useState([])
    

    useEffect(() => {
        console.log('useEffect home')
        
        async function getUsers(){
            const { data, errorUsers } = await supabase.from("users").select();
            setUsers(data)
            setErrorUser(errorUsers)
        }

        async function checkID(){

          async function getUserID(){
            let id = ""
            const {data, error} = await supabase.auth.getUser()
            if(!error) id = data.user.id
            return { id: id, errorG: error }
          }
          const { id, errorG } = await getUserID()
          const { data, error } = await supabase.from("users").select('username, id').eq('id', id)
          if(data) setExistMyUser(true)
          setLoading(false)

      }

        checkID()
        getUsers()
    },[])
  

  function Loading() {
    return(
      <h2>Loading</h2>
    )
  }

  function RegisterUser(){

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

    </div>
    )
  }

return (

    <>
        {users && (
            users.map((user, key)=>(
                <h2 key={key} >{user.username} id: {user.id }</h2>
            )
            )
        )}
        {loading && (<Loading />)}
        {(!loading && !existMyUser) && (<RegisterUser />)}
        <Button onClick={()=>supabase.auth.signOut()}>LogOut</Button>
    </>

    
  )
}
  