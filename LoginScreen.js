import { React, Component } from "react";
import { StyleSheet, View, Button, Text } from "react-native";
//import firebase from 'firebase';

import * as Google from "expo-google-app-auth";

const ANDROID_CLIENT_ID = "91528963395-991jv40h0q0ttimemukjo4qn 7l2i8jjd.apps.googleusercontent.com";

//const IOS_CLIENT_ID = "your-ios-client-id";


export default class LoginScreen extends Component {
  signInWithGoogleAsync = async () => {
    try {
      const result = await Google.logInAsync({
        androidClientId: ANDROID_CLIENT_ID,
        //iosClientId: YOUR_CLIENT_ID_HERE,
        success: ["profile", "email"]
      });

      if (result.type === "success") {
        console.log("LoginScreen.js", result.user.givenName);
        this.props.navigation.navigate("Home", {
          username: result.user.givenName
        })
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (error) {
      console.log("LoginScreen.js", error)
      return { error: true };
    }
  }
      
    render() {
        return (
            <View style={styles.container}>
                <Button title = "Google Sign in" onPress = {() => this.signInWithGoogle}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center'
  }
})

