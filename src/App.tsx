import './index.css'
import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from "./utils/supabase"
import Home from './pages/Home'






export default function App() {
  const [session, setSession] = useState(null)
  const [users, setUsers] = useState([])


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    
    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} providers={['google', 'facebook']} appearance={{ theme: ThemeSupa }} />)
  }
  else {
    return (<Home session = {session} supabase = {supabase} />)
  }
}