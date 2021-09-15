import { React, Component } from "react";
import { StyleSheet, View, Button, Text } from "react-native";

export default class HomeScreen extends Component {
    render() {
        return (
            <View style = {styles.container}>
                <Text> HomeScreen </Text>
                <Text> Welcome, {this.props.navigation.getParam("username")}</Text>
                <Button title = "Sign out" onPress = {() => this.props.navigation.navigate("Login")}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})