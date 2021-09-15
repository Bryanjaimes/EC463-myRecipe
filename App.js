import React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ListItem } from 'react-native-elements';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import firebase from 'firebase';
import { firebaseConfig } from './config';

import LoginScreen from './screens/LoginScreen.js';
import LoadingScreen from './screens/LoadingScreen.js';
import HomeScreen from './screens/HomeScreen.js';

firebase.initializeApp(firebaseConfig);

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen:LoadingScreen,
  LoginScreen:LoginScreen,
  HomeScreen:HomeScreen
})

const AppNavigator = createAppContainer(AppSwitchNavigator);

export default class App extends React.Component {

  state = {
    loading: false,
    query: '',
    barcodes: [],
    description: '',
    foods: [],
    data: '',
    cameraOn: false,
    hasPermission: null,
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
  }

  renderCamera() {
  if (this.state.hasPermission === false || this.state.hasPermission === null) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <Button title={'Go Back'} onPress={() => this.handleBackSearch()} />
    </View>
  )
  }

  renderHomePage () {
    return (
      <View style={{
        justifyContent: "center",
        alignItems: "stretch", 
        }}>
        <TextInput style={styles.title}
          placeholder="RecipeName"
        />
        <TextInput style = {styles.search} 
          onChangeText={this.handleInputSearch} 
          value={this.state.query}
          placeholder="Enter a meal or ingredient"
        />
        <Button 
        onPress = {() => this.setState({ cameraOn: true })}
        title = "Scan Barcode"
        ></Button>
        <FlatList 
          data={this.state.foods}
          renderItem={this.renderItem}
          keyExtractor={item => item.fdcID}
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
    if (!this.state.cameraOn){
      return this.renderHomePage();
    }
    else {
      return this.renderCamera();
    }
  }
}

const styles = StyleSheet.create({
  title: {
    paddingTop:100,
    fontSize: 50,
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
})