
export default function Home(supabase, session){
    
    return(
        <div>
            <h1>Home</h1>
            <button onClick={() => supabase.auth.signOut().then((res)=>console.log(res))}>Sign out</button>
        </div>
    )
}