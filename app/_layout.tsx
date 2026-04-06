import { Stack } from "expo-router";
import { useEffect,useState } from "react";
export default function RootLayout()
{
    const[isLoggedIn,setIsLoggedIn]=useState(false);
    useEffect(()=>
    {
        const token=null;
        if(token)
        {
            setIsLoggedIn(true);
        }
    },[]);
    return (
        <Stack screenOptions={{headerShown:false}}>
            {isLoggedIn ?
            (
                <Stack.Screen name="(tabs)"/>
            ):(
            <Stack.Screen name="(auth)/login"/>
                )}
        </Stack>
    );  
}