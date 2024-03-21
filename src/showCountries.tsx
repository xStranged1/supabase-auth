
import { useEffect, useState } from "react";
import { supabase } from "./utils/supabase"
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'


function App() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    getCountries();
  }, []);

  async function getCountries() {
    const { data } = await supabase.from("countries").select();
    const { users } = await supabase.schema("auth").from("users").select();
    setCountries(data);
  }

  return (
    <>
    <div style={{display: "flex", justifyContent:"center", alignItems: "center"}}>
      <ul>
        {countries.map((country) => (
          <li key={country.name}>{country.name}</li>
        ))}
      </ul>
        <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'facebook', 'twitter']}
      />
    </div>
    </>
  );
}

export default App;