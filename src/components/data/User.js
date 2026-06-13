import { useState,useEffect } from "react";
import axios from "..api/axios";
 const Users=()=>{
    const [user,setUser]=useState();
    return(
        <article>
            <h2>UserList</h2>
            {user?.length 
        ?(
            <ul>
                
                    {user.map((user,i)=> <li key={i}>{user?.username}></li>)}
                
            </ul>
        )    :<p>No User to Dispaly</p>
        }
        </article>
    );
    
 };
 export default user;