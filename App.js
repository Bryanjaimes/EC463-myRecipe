//import LoginScreen from "./screens/LoginScreen.js";
//import HomeScreen from "./screens/HomeScreen.js";
import React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ListItem } from 'react-native-elements';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Google from "expo-google-app-auth";

const ANDROID_CLIENT_ID = "91528963395-991jv40h0q0ttimemukjo4qn 7l2i8jjd.apps.googleusercontent.com";

//const IOS_CLIENT_ID = "your-ios-client-id";
//import firebase from 'firebase';
//import { firebaseConfig } from './config';

//firebase.initializeApp(firebaseConfig);

/*const MainNavigator = createSwitchNavigator({
  Login: {screen: LoginScreen},
  Home: {screen: HomeScreen}
});

const App = createAppContainer(MainNavigator);*/

export default class App extends React.Component {

  state = {
    loading: false,
    query: '',
    barcodes: [],
    description: '',
    foods: [],
    userRecipes: [],
    data: '',
    cameraOn: false,
    hasPermission: null,
    loggedIn: true,
    scanned: false
  };

  async componentDidMount() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({ scanned: true })
    this.search(data.substring(1));
    this.setState({ scanned:false });
    alert(` Bar code with type ${type} and data ${data} has been scanned!`);
    //alert(`Scanned successfully! \n \n ${this.state.description}`)
    this.setState({ cameraOn: false })
  };

  handleBackSearch() {
    this.setState({ cameraOn: false });
    this.setState({ scanned: false });
    this.setState({ makingRecipe: true});
  }

  renderLogin(){
    return (
      <View style={{
        justifyContent: "center",
        alignItems: "stretch", 
        }}>
        <Text style={styles.title}
          placeholder="TEST LOGIN"
        />
      </View>
    );
  }

  renderHomePage(){
    return (
      <View style={{
        justifyContent: "center",
        alignItems: "stretch", 
        }}>
        <Text style = {styles.title}> Welcome USER </Text>
        <Button 
        onPress = {() => this.setState({ makingRecipe: true })}
        title = "Add a Recipe"
        ></Button>
        <Text style = {styles.smallText}> Your Recipes: </Text>
        <FlatList 
          data={this.state.userRecipes}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
  

  renderCamera() {
  if (this.state.hasPermission === false || this.state.hasPermission === null) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCo deScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <Button title={'Go Back'} onPress={() => this.handleBackSearch()} />
    </View>
  )
  }

  renderRecipePage () {
    return (
      
      <View>
        <Button
        onPress = {() => this.setState({ makingRecipe: false })}
        title = "Cancel"
        ></Button>
        <TextInput style={styles.title}
          placeholder="Enter recipe name"
        />
        <TextInput style = {styles.search} 
          onChangeText={this.handleInputSearch} 
          value={this.state.query}
          placeholder="Search for item or ingredient"
        />
        <Button 
        onPress = {() => this.setState({ cameraOn: true, makingRecipe: false })}
        title = "Scan Barcode"
        ></Button>
        <FlatList 
          data={this.state.foods}
          renderItem={this.renderItem}
          keyExtractor={item => item.fdcID}
          //extraData = {selectedId} will be used for selection of item to add
        />
      </View>
    );
  }

  renderItem = ({ item }) => (
  <ListItem bottomDivider>
    <Text>{item.description}</Text>
  </ListItem>
  )

  search = async (val) => {
    console.log('searching');
    this.setState({ loading: true });
    try{
      const res = await axios(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=fZ4u39zBJOhv0a2FK1EY8sGRBaYm7R0mYa8JSkl1&query=${val}`
      );  
      
      this.state.scanned ? console.log('true') : console.log('false');
      if (this.state.scanned){
        var description = await res.foods[0].description;
        console.log('description', description);
        this.setState({ description }); 
      }
      else{
        var foods = await res.data.foods;
        var data = await res.data;
        this.setState({ foods });  
      }

      this.setState({ foods }); 
     
      if (this.state.query === ''){
        this.setState({ data: '' })
      }
    }
    catch{
      this.setState({ foods: [] })
    }
  };

  handleInputSearch = (newText) => {
    this.search(newText);
    this.setState({ query: newText })
  }

  render() {
    if (!this.state.loggedIn){
      return this.renderLogin();
    }

    else{
      if(this.state.cameraOn && !this.state.makingRecipe){
        return this.renderCamera();
      }
      
      else if(!this.state.cameraOn &&this.state.makingRecipe) {
        return this.renderRecipePage();
      }

      else{
        return this.renderHomePage();
      }
    }
  }
}

const styles = StyleSheet.create({
  title: {
    paddingTop: 30,
    fontSize: 40,
    color: "#05CDE4",
  },
  search: {
    height: 100,
  },
  container: {
    flex: 1,
  },
  scanner: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  goBack: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  smallText:{
    fontSize: 20,
    color: "#05CDE4",
  },
})