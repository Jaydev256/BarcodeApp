import React, { useState } from "react";
import {View,Text,TextInput,Button,StyleSheet} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Login()
{
    const router =useRouter();
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const hadleLogin=async()=>{
        const res=await fetch("http://10.5.91.199:3000/users")
            if(!email||!password){
                alert("please enter all fields");
                return;
            }
           try{
            const res=await fetch("http://localhost:3000/users");
            const users=await res.json();


            const user=users.find(
                (u:any)=>u.email===email&&u.password===password
            );
            if(!user)
            {
                alert("Invalid credentials");
                return;
            }
            //Token creattion 
            await AsyncStorage.setItem("token","user_logged_in");
            await AsyncStorage.setItem("user",JSON.stringify(user));
            alert("Logged in");
            router.replace("/(tabs)");
        }
        catch(error)
        {
            console.log(error);
            
        }        
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}  
            />

            <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}  
            />
                 
                 <Button title="Login" onPress={hadleLogin}/>

                 <Text style={styles.link} onPress={()=>
                    router.push("/auth/Signup")}>
                        Dont have account ? signup
                    </Text>
        </View>
    );
}

const styles=StyleSheet.create({
    container:{flex:1,justifyContent:"center",padding:20},
    title:{fontSize:28,marginTop:20,textAlign:"center"},
     input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "blue",
  },
})