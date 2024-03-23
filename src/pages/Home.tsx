import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import RegisterUser from '../components/ui/RegisterUser'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { User } from '../types'

export default function Home({session, supabase}) {


    const [loading, setLoading] = useState(true)
    const [users, setUsers] = useState([])
    const [existMyUser, setExistMyUser] = useState(false)
    const [errorUser, setErrorUser] = useState([])


    function UsersTable() {
      return (
        <Table>
          <TableCaption>Todos los usuarios registrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Usuario</TableHead>
              <TableHead>id</TableHead>
              <TableHead className="text-right">E-mail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: User) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell className="text-right">{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )
    }
    
    

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
      <h2>Loading...</h2>
    )
  }

  

return (

    <>
        {loading && (<Loading />)}
        {(!loading && !existMyUser) && (<RegisterUser session = {session} supabase = {supabase} />)}
        <Button onClick={()=>supabase.auth.signOut()}>LogOut</Button>
        {(!loading && existMyUser) && (
          <UsersTable />
        )}
        
    </>

    
  )
}
  