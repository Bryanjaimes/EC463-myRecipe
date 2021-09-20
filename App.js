import React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { ListItem } from 'react-native-elements';
import { BarCodeScanner } from 'expo-barcode-scanner';
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBBUdYxMqQ64il6FfH3zpHvQbC5Qn0Y72o",
  authDomain: "myrecipe-999d6.firebaseapp.com",
  projectId: "myrecipe-999d6",
  storageBucket: "myrecipe-999d6.appspot.com",
  messagingSenderId: "91528963395",
  appId: "1:91528963395:web:e57efbad4fcaf75568fbf6",
  measurementId: "G-MBNZSWJRXF"
};

firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {

  constructor(props){
    super(props)

    this.state = ({
      email: '',
      password: '',
      query: '',
      barcodes: [],
      description: '',
      ingredients: '',
      nutrients: [],
      foods: [],
      userRecipe: '',
      data: '',
      cameraOn: false,
      hasPermission: null,
      loggedIn: false,
      scanned: false,
      showNutritionInfo: false,
      ingredListPlaceHold: [],
      ingredPlaceHold: '',
      isRender: false,
      isModalVis: false,
      inputText: '',
      editItem: '',

      recipeIngredients: [
        {
          id: 1,
          title: 'Item 1'
        },
        {
          id: 2,
          title: 'Item 2'
        },
        {
          id: 3,
          title: 'Item 3'
        },
        {
          id: 4,
          title: 'Item 4'
        },
        {
          id: 5,
          title: 'Item 5'
        },
        {
          id: 6,
          title: 'Item 6'
        },
        {
          id: 7,
          title: 'Item 7'
        },
        {
          id: 8,
          title: 'Item 8'
        },
        {
          id: 9,
          title: 'Item 9'
        },
        {
          id: 10,
          title: 'Item 10'
        }
      ],
    
      tempRecipes: [
        {
          id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
          title: 'Recipe 1',
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
          title: 'Recipe 2',
        },
        {
          id: '58694a0f-3da1-471f-bd96-145571e29d72',
          title: 'Recipe 3',
        },
        {
          id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28bww',
          title: 'Recipe 4',
        },
        {
          id: '3ac68afc-c605-48d3-a4f8-fbd9w7f63',
          title: 'Recipe 5',
        },
        {
          id: '58694a0f-3da1-471f-bd96-efnje29d72',
          title: 'Recipe 6',
        },
        {
          id: 'bd7acbea-c1b1-46c2-aed5d53abb28bww',
          title: 'Recipe 7',
        },
        {
          id: '3ac68afc-c605-48a4f8-fbd9w7f63',
          title: 'Recipe 8',
        },
        {
          id: '58694a0f-3da16-efnje29d72',
          title: 'Recipe 9',
        },
      ],

    })

  }


  signupUser = (email, password) => {
    try{
      if(this.state.password.length<8){
        alert("Password must be at least 8 characters")
        return;
      }

      else{
      this.setState({ cameraOn: false, makingRecipe: false, loggedIn: true})
      firebase.auth().createUserWithEmailAndPassword(email, password)
      console.log(1)
      }

    }

    catch(error){
      console.log(error.toString())
    }

  }

  loginUser = (email, password) => {
    try{
      if(this.state.password.length<8){
        alert("Password must be at least 8 characters")
        return;
      }

      else{
        this.setState({ cameraOn: false, makingRecipe: false, loggedIn: true})
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
          console.log(1)
      })
      }
    }

    catch(error){
      console.log(error.toString())
    }
  }

  signOutUser = () => {
    this.setState({ cameraOn: false, makingRecipe: false, loggedIn: false})
  }



  async componentDidMount() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  handleBackSearch() {
    this.setState({ cameraOn: false });
    this.setState({ scanned: false });
    this.setState({ makingRecipe: true});
    this.setState({ showNutritionInfo: false});
  }

  renderLogin(){
    return (
      <View style={styles.container}>
        <TextInput style={styles.smallText}
          placeholder="Email"
          textContentType = 'emailAddress'
          autoCorrect = {false}
          onChangeText = {(email) => this.setState({email})}
        />
        <TextInput style = {styles.smallText2} 
          placeholder="Password"
          textContentType = 'password'
          secureTextEntry = {true}
          autoCorrect = {false}
          onChangeText = {(password) => this.setState({password})}
        />
        <Button 
        onPress = {() => this.loginUser(this.state.email, this.state.password)}
        title = "Login"
        ></Button>
        <Button 
        onPress = {() => this.signupUser(this.state.email, this.state.password)}
        title = "Sign up"
        ></Button>
        <Text style = {styles.title}> myRecipe </Text>
        <Text style = {styles.logo}> \ </Text>
        <Text style = {styles.logo}> (  )(  ) </Text>
        <Text style = {styles.logo}> (  )(  )(  ) </Text>
        <Text style = {styles.logo}> (  )(  ) </Text>
        <Text style = {styles.logo}> (  ) </Text>
      </View>
    );
  }

  renderHomePage(){
    return (
      <View style={{
        justifyContent: "center",
        alignItems: "stretch", 
        }}>
        <Text style = {{paddingTop: "5%", alignSelf: 'center',}} > Signed in as</Text>
        <Text style = {styles.smallText}> {this.state.email} </Text>
        <Text style = {styles.smallText}> Your Recipes: </Text>
        <FlatList 
          style={{ height: "40%", paddingBottom: "30%" }}
          data={this.state.tempRecipes}
          renderItem={this.renderRecipe}
        />
        <Button 
        style = {{ backgroundColor: "green" }}
        onPress = {() => this.setState({ cameraOn: false, makingRecipe: true, userRecipe: '' })}
        title = "Create New Recipe"
        ></Button>
        <Button 
        onPress = {() => this.setState({ cameraOn: false, makingRecipe: false, loggedIn: false})}
        title = "Sign Out"
        ></Button>
      </View>
    );
  }

  renderRecipePage () {
    return (
      <View style={styles.container}>
        <TextInput style={styles.smallText}
          placeholder="Enter recipe name"
          value = {this.state.userRecipe}
          onChangeText = {(userRecipe) => this.setState({userRecipe})}
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
        <Button
        onPress = {() => this.setState({ makingRecipe: false })}
        title = "Cancel"
        ></Button>
        <FlatList 
          data={this.state.foods}
          renderItem={this.renderFood}
          keyExtractor={item => item.fdcID}
          //extraData = {selectedId} will be used for selection of item to add
        />
        <Text style = {styles.smallerText}> Ingredients in this Recipe: </Text>
        <FlatList 
          data={this.state.recipeIngredients}
          renderItem={this.renderRecipe}
          //Attempted to create editable recipe ingredients after adding but had trouble with TouchableOpacity and modal
        />
      </View>
    );
  }

  renderCamera() {
    if (this.state.hasPermission === false || this.state.hasPermission === null) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={{ flex:1 }}>
        <BarCodeScanner
          onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <Button title={'Go Back'} 
         style = {styles.goBack}
         onPress={() => this.handleBackSearch()} />
      </View>
    )
  }

  renderNutritionPage() {
    return (
      <View style={styles.container}>
        <Text style = { styles.description }>{ this.state.description }</Text>
        <Text style = { styles.ingredients }>Ingredients:</Text>
        <Text>{this.state.ingredients}</Text>
        <Text style = { styles.ingredients }>Nutrients:</Text>
        <FlatList 
        data={this.state.nutrients}
        renderItem={this.renderNutrient}
        keyExtractor={item => item.nutrientID}
        />
        <Button title={'Add to Recipe'} 
         onPress={description => this.setState({ ingredPlaceHold: description, cameraOn: false, scanned: false, showNutritionInfo: false, makingRecipe: true })}
         />
        <Button title={'Go Back'} 
         style = {styles.goBack}
         onPress={ () => { this.setState({cameraOn: false, scanned: false, showNutritionInfo: false, makingRecipe: true }) }}
         />
      </View>
    )
  }

  renderFood = ({ item }) => (
    <ListItem bottomDivider>
      <Button
      onPress={() => {
        this.search(item.description);
        console.log(item.description);
        this.setState({ showNutritionInfo: true, makingRecipe: false, description: item.description, scanned: true,  recipeIngredients: item});
      }}
      title = {item.description}>
      </Button>
    </ListItem>
    )

  renderNutrient = ({ item }) => (
    <ListItem bottomDivider>
      <Text>{item.nutrientName}: {item.value} {item.unitName}</Text>
    </ListItem>
    )

  renderRecipe = ({ item }) => (
    <ListItem bottomDivider>
      <Button
      title = {item.title}>
      </Button>
    </ListItem>
    )

  renderIngredients = ({item, index}) => {
    return (
      <TouchableOpacity
      onPress = {() => onPressItem(item)}>
        <Text> {item.text} </Text>
      </TouchableOpacity>
    )
  }

  handleBarCodeScanned = async ({ type, data }) => {
    this.setState({ scanned: true })
    this.search(data.substring(1));
    //alert(` Bar code with type ${type} and data ${data} has been scanned!`);
    alert(`Scanned successfully!`)
    this.setState({ cameraOn: false })
  };

  search = async (val) => {
    this.setState({ showNutritionInfo: true })
    console.log('searching');
    try{
      const res = await axios(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=fZ4u39zBJOhv0a2FK1EY8sGRBaYm7R0mYa8JSkl1&query=${val}`
      );  

      if (this.state.scanned){
        var description = res.data.foods[0].description;
        var ingredients = res.data.foods[0].ingredients;
        var nutrients = res.data.foods[0].foodNutrients;
        console.log(nutrients);
        this.setState({ description: description, ingredients: ingredients, nutrients: nutrients }); 
      }
      else {
        var foods = await res.data.foods;
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
      if(this.state.cameraOn){
        return this.renderCamera();
      }
      else if(this.state.makingRecipe) {
        return this.renderRecipePage();
      }
      else if(this.state.showNutritionInfo) {
        return this.renderNutritionPage();
      }
      else{
        return this.renderHomePage();
      }
    }
  }
}

const styles = StyleSheet.create({
  title: {
    fontSize: 60,
    color: "#6F2DA8",
    alignSelf: 'center',
    paddingTop: "28%",
  },
  logo: {
    fontSize: 20,
    color: "#6F2DA8",
    alignSelf: 'center',
  },
  search: {
    height: 100,
    fontSize: 20,
    color: "#6F2DA8",
    alignSelf: 'center',
    paddingTop: "10%",
    paddingBottom: "5%"
  },
  container: {
    marginHorizontal: 20,
    height:"97%"
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
    paddingTop:300,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  smallText:{
    fontSize: 30,
    color: "#6F2DA8",
    alignSelf: 'center',
    paddingTop: "20%",
    paddingBottom: "5%"
  },
  smallText2:{
    fontSize: 30,
    color: "#6F2DA8",
    alignSelf: 'center',
    paddingTop: "5%",
    paddingBottom: "5%"
  },
  smallerText:{
    fontSize: 20,
    color: "#6F2DA8",
    alignSelf: 'center',
    paddingTop: "20%",
    paddingBottom: "5%"
  },
  button:{
    fontSize: 100
  },
  description:{
    paddingTop: "15%",
    fontSize: 20,
    color: "#6F2DA8",
    alignSelf: 'center',
    fontWeight: "bold"
  },
  ingredients:{
    paddingTop: "5%",
    fontSize: 15,
    color: "#6F2DA8",
    alignSelf: 'center',
  }
})