import React, { useState } from "react";
import {View,Text,TextInput,Button,StyleSheet} from "react-native";
import { useRouter } from "expo-router";

export default function Signup()
{ 
    const router =useRouter();

    const[name,setName]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");

    const handleSignup=async()=>{
        if(!name||!email||!password)
        {
            alert("enter details first ");
            return;
        }
        try{ 
            //check is user is present or not
            const chechkRes=await  fetch("http://localhost:3000/users");
            const users =await chechkRes.json();
            const exists=users.find((u:any)=>u.email===email);

            if(exists)
            {
                alert("user already exists");
                return;
            }

            //under this user fetch details
            await fetch("http://localhost:3000/users",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    name,email,password,
                }),
            });
            alert("signed IN");
            router.replace("/auth/Login");
        } catch(error){
            console.log(error);
            
        }
    };
        
    return (
        <View style={styles.container}>
            <Text style={styles.title}> Signup </Text>
           
           <TextInput
           placeholder="Name"
           style={styles.input}
           value={name}
           onChangeText={setName}
           />

            <TextInput
           placeholder="email"
           style={styles.input}
           value={email}
           onChangeText={setEmail}
           />

           <TextInput
           placeholder="Password"
           style={styles.input}
           value={password}
           onChangeText={setPassword}
           />

           <Button title="Signup" onPress={handleSignup}/>

           <Text style={styles.link} onPress={()=>router.push("/auth/Login")}>
            Already have an account?Login
           </Text>
        </View>

    );
}

const styles=StyleSheet.create({
    container:{flex:1,justifyContent:"center",padding:20},
    title:{fontSize:28,marginBottom:20,textAlign:"center"},
    input:{
       borderWidth:1,
       padding:10,
       marginBottom:15,
       borderRadius:15,
    },
    link:{
        marginTop:15,
        textAlign:"center",
        color:"blue",
    },
});
