import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import firebase from 'firebase';



class LoadingScreen extends Component {
    
    componentDidMount() {
        this.logInCheck();
    }

    logInCheck = () => {
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.props.navigation.navigate('HomeScreen');
            } 
            
            else{
                this.props.navigation.navigate('LoginScreen');
            }

        });
    };


    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator/>
            </View>
        );
    }

}

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});