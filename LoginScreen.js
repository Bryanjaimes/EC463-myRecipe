import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button, TouchableOpacity } from 'react-native';

class LoginScreen extends Component {

signInWithGoogleAsync = async () => {
  try {
    const result = await Google.logInAsync({
      androidClientId: '91528963395-991jv40h0q0ttimemukjo4qn 7l2i8jjd.apps.googleusercontent.com',
      //iosClientId: YOUR_CLIENT_ID_HERE,
      scopes: ['profile', 'email'],
    });

    if (result.type === 'success') {
      return result.accessToken;
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
}
    
    render() {
        return (
            <View style={styles.container}>
                <Button 
                    title = "Google Sign in"
                    onPress = {() => this.signInWithGoogleAsync}/>
            </View>
        );
    }

}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});