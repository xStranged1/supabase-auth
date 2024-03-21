import './index.css'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from "./utils/supabase"


function Home({session}){

  useEffect(() => {
    console.log('use home');
    async function getUsers() {
      const { users } = await supabase.schema("auth").from("users").select();
      
    }
    console.log(session);
    
    
  },[])
    
  return(
      <div>
          <h1>Hola! {session.user.user_metadata.full_name} </h1>
          <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
  )
}



export default function App() {
  const [session, setSession] = useState(null)
  const [users, setUsers] = useState([])


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} providers={['google', 'facebook']} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    return (<Home session = {session} />)
  }
}