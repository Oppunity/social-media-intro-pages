
import React, { Fragment, Component } from 'react'
import {Dimensions, ImageBackground, TouchableWithoutFeedback, Keyboard, View, Button, TextInput, StyleSheet, Image, TouchableOpacity, Text, KeyboardAvoidingView} from 'react-native'
import normalize from 'react-native-normalize'
import PhoneInput from 'react-native-phone-input'
import Animated, { Easing } from 'react-native-reanimated';



const { width, height } = Dimensions.get('window')
const DismissKeyboardHOC = (Comp) => {
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Comp {...props}>
        {children}
      </Comp>
    </TouchableWithoutFeedback>
  );
};
const DismissKeyboardView = DismissKeyboardHOC(View)



const initialState = {
    username: '', password: '',  phone_number: '', authenticationCode: '', showConfirmationForm: false
  }
  
class SignUpPage extends Component {
    
    static navigationOptions = {
        header: null
    }

    state = initialState
    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }
    
    constructor() {
      super();
  
      this.state = {
        valid: "",
        type: "",
        phone_number: ""
      };
  
      this.updateInfo = this.updateInfo.bind(this);
    }
    async componentDidMount() {
    
      await Auth.signOut()
      .then(() => {
      //{this.completeso()}
      })
      .catch(err => {
      console.log('err: ', err)
      })

    //console.log(this.state.IDENTITYID)
}
    updateInfo() {
      this.setState({
        phone_number: this.number.getValue()
      });
    }
  
    isEmailValid = () => {
      let email = this.state.username
      let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      let correctEmail = pattern.test(String(email).toLowerCase())
      if (correctEmail === true) {
       // console.log(correctEmail)
        {this.signUp()}
      }
      else {
       // console.log(correctEmail)
        alert('Please input a valid email.')
      }
    }

    signUp = async () => {
      const { username, password, email, phone_number } = this.state
      if ( this.state.password === undefined || this.state.username === undefined || this.state.username.length === 0 || this.state.password.length < 8  || !(/([A-Z]+)/g.test(password)) || !(/([a-z]+)/g.test(password)) || !(/([0-9]+)/g.test(password))){
               alert('Please make sure you have entered a valid email address and a password of at least 8 characters (with at least one number, lowercase, and capital letter).');
        return
      }

    
      try {
        const success = await Auth.signUp({ username, password, attributes: { phone_number: this.state.phone_number }})
        console.log('user successfully signed up!: ', success)
        this.setState({ showConfirmationForm: true })
      } catch (err) {
        console.log('error signing up: ', err)
      }
    }

    
    confirmSignUp = async () => {
      const { username, password, authenticationCode } = this.state
      try {
        await Auth.confirmSignUp(username, authenticationCode) 
        console.log('successully signed up!') 
        alert('User signed up successfully!')

        await Auth.signIn(username, password)
        const user = await Auth.signIn(username, password) 
        console.log('USER IS THIS PERSON????     ',user)
        const credentials = await Auth.currentCredentials()
        console.log('CURRENT CREDENTIALS              ',credentials)
       // console.log('user successfully signed in!', user)
       console.log('user successfully signed in! ')
        
        alert('user successfully signed in!');

        this.setState({ ...initialState })
        this.props.navigation.push('AccountSelect')
      } catch (err) {
        console.log('error confirming signing up: ', err)
      }
    }
    


    render() {
      return (
        
        
        <View
        style = {{flex: 1, backgroundColor: 'black', justifyContent: 'center', }}
        >



        <Image source={require('../assets/logo.png')}
            style = {{ position: 'absolute', left: '20%', top: 80}}
        />

        <TouchableOpacity
       activeOpacity= {0.5}
       onPress={() => this.props.navigation.push('LogIn')}
       >
       
      </TouchableOpacity>
          {
            !this.state.showConfirmationForm && (
              <Fragment>
               
              
                <TextInput
                  style={styles.textInput}
                  placeholder='Email'
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={val => this.onChangeText('username', val)}
                  
                />
                <TextInput
                  style={styles.textInput}
                  placeholder='Password'
                  secureTextEntry={true}
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={val => this.onChangeText('password', val)}
                />
                


        
       
                {/*<Text style = {{ fontSize: 15,fontWeight: '500', color: '#ffffff', textAlign: 'center', marginTop: -1}}>Email is required</Text>{*/}
            <TouchableOpacity 
                        onPress={this.isEmailValid}
                        style ={{height: 50, width: 260, borderRadius: 25, backgroundColor: 'cyan', left: '14%'}}> 
               
            <Text style = {{ fontSize: 16,fontWeight: 'bold', color: 'black', textAlign: 'center', marginTop: 15}}> SIGN UP</Text>
       </TouchableOpacity>

       



<View style = {{flexDirection: 'row', bottom: 50, position: 'absolute', width: '100%'}}> 
       <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('HomeScreen') }
                        style ={{...styles.button, backgroundColor: 'black', justifyContent: 'center',left: 40}}> 
               
            <Text style = {{ fontSize: 18,fontWeight: '500', color: 'white', textAlign: 'center', marginTop: -1, }}> BACK </Text>
       </TouchableOpacity>

       <TouchableOpacity 
                        onPress={() => this.props.navigation.navigate('LogIn') }
                        style ={{...styles.button, backgroundColor: 'black', justifyContent: 'center', right: 40, position:'absolute'}}> 
               
            <Text style = {{ fontSize: 18,fontWeight: '500', color: 'white', textAlign: 'center', marginTop: -1, }}> NEXT </Text>
       </TouchableOpacity>
       </View>

              </Fragment>
            )
          }
          {
            this.state.showConfirmationForm && (
              <Fragment>
                <TextInput
                  style={styles.input}
                  placeholder='Authentication code'
                  autoCapitalize="none"
                  placeholderTextColor='white'
                  onChangeText={val => this.onChangeText('authenticationCode', val)}
                />
                <Button
                  title='Confirm Sign Up'
                  onPress={this.confirmSignUp}
                />
              </Fragment>
            )
          }
        </View>

      )
    }
  }
  
  const styles = StyleSheet.create({

    textInput: {
        height: 60,
        borderRadius: 30,
        borderWidth: 0.5,
        marginHorizontal: 35,
        marginLeft: 20,
        paddingLeft: 30,
        marginVertical: 5,
        borderColor: 'cyan',
        color: 'white',
        top: -20,
        color: 'white'
    
      },

    input: {
      width: 350,
      height: 55,
      backgroundColor: 'black',
      margin: 10,
      padding: 8,
      color: 'white',
      borderRadius: 14,
      marginTop: 10
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black'
    },
    info: {
      // width: 200,
      borderRadius: 5,
      backgroundColor: "#f0f0f0",
      padding: 10,
      marginTop: 20
    },
    button: {
      marginTop: 20,
      padding: 10,
      width: 140,
      height: 45,
      borderRadius: 15,
      borderColor: 'white',
      borderWidth: 1
    }
  })

export default SignUpPage; 