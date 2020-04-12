import React, { Component } from 'react';
import { Text, View, StyleSheet, Dimensions, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import Animated, { Easing } from 'react-native-reanimated';
import { TapGestureHandler, State} from 'react-native-gesture-handler';
import Svg, { Image, Circle, ClipPath} from 'react-native-svg';
import {ScreenOrientation} from 'expo-screen-orientation'
import { Video } from 'expo-av';

import FontAwesome from "react-native-vector-icons/FontAwesome";
import * as Animatable from 'react-native-animatable';
import { TypingAnimation } from 'react-native-typing-animation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const { width, height } = Dimensions.get('window')
const { Value, event, block, cond, eq, set, Clock, startClock, stopClock,
debug, timing, clockRunning, interpolate, Extrapolate, concat } = Animated;

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


function runTiming(clock, value, dest) {  
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0)
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease)
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock)
    ]),
    timing(clock, state, config),
    cond(state.finished, debug('stop clock', stopClock(clock))),
    state.position
  ]);
}

class HomeScreenPage extends React.Component {
    static navigationOptions = {
    header: null
  } 

  constructor(props){
    super(props);
    this.state={
      typing_email: false,
      typing_password: false,
      animation_login : new Animated.Value(width-40),
      enable:true
    }
  
    
    this.buttonOpacity = new Value(1)

   

    this.loginPress = event([
      {
        nativeEvent:({state}) =>
         block([
          cond(
            eq(state, State.END), 
            set(this.buttonOpacity, runTiming(new Clock(),1,0))
            )
        ])
      }
    ]);

    this.onCloseState = event([
      {
        nativeEvent:({state}) =>
         block([
          cond(
            eq(state, State.END), 
            set(this.buttonOpacity, runTiming(new Clock(),0,1))
            )
        ])
      }
    ]);
     
    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0,1],
      outputRange: [100,0],
      extrapolate: Extrapolate.CLAMP
    });

    {/* the background will slide up a certain height when this.bgY is called*/}
    this.bgY =  interpolate(this.buttonOpacity, {
      inputRange: [0,1],
      outputRange: [-height / 3 - 80, 0],
      extrapolate: Extrapolate.CLAMP
    });

   
{/*when you click on the login button, the email and password fields will slide up from the bottom of the screen*/}
    this.loginInputZindex = interpolate(this.buttonOpacity, {
      inputRange: [0,1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP
    })

    this.loginInputY = interpolate(this.buttonOpacity, {
      inputRange: [0,1],
      outputRange: [0,100],
      extrapolate: Extrapolate.CLAMP
    });

    this.loginInputOpacity = interpolate(this.buttonOpacity, {
      inputRange: [0,1],
      outputRange: [1,0],
      extrapolate: Extrapolate.CLAMP
    });
    {/*when you click on the login button, the email and password fields will slide up from the bottom of the screen*/}

    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0,1],
      outputRange: [180,360],
      extrapolate: Extrapolate.CLAMP
    });

    
  }

  _foucus(value){
    if(value=="email"){
      this.setState({
        typing_email: true,
        typing_password: false
      })
    }
    else{
      this.setState({
        typing_email: false,
        typing_password: true
      })
    }
  }

  _typing(){
    return(
      <TypingAnimation 
        dotColor='#93278f'
        style={{marginLeft:'82%', top:'-42%',  height: 35}}
      />
    )
  }
  
  _animation(){
    Animated.timing(
      this.state.animation_login,
      {
        toValue: 40,
        duration: 250
      }
    ).start();

    setTimeout(() => {
      this.setState({
        enable:false,
        typing_email: false,
        typing_password: false
      })
    }, 150);
  }

  render(){
    const { navigation } = this.props;
    const width = Dimensions.get("screen").width;
    
    
  return (
    <KeyboardAvoidingView
    
    behavior="padding"
    >
      <DismissKeyboardView>
    
    
    <View style = {{height: '100%', width: '100%', justifyContent: 'flex-end', backgroundColor: 'black' }}>
 
        <Animated.View 
        style = {{
          ...StyleSheet.absoluteFill,
        transform:[{translateY: this.bgY}]
        }}
        >
        <Svg height = {height+50} width = {width}>
        <ClipPath id = "clip">

          <Circle r = {height+20} cx = {width /2} />
        </ClipPath>

      
             </Svg>

{/* start of background video component */}
             <Video
  source={require('../assets/video1.mp4')}
  rate={1.0}
  volume={1.0}
  isMuted={true}
  resizeMode="cover"
  shouldPlay
  isLooping
  style={{ width: '100%', height: '100%', position: 'absolute'}}
/>
{/* end of background video component */}

        </Animated.View>
     
        
 {/* start of signup button that loses opacity and slides down the screen when pressed*/}
         <Animatable.View animation={'zoomIn'} delay={800} duration={900}>
        

            <Animated.View
             style = {{...styles.buttons, opacity: this.buttonOpacity, backgroundColor: 'white', bottom: 30,
             transform:[{translateY:this.buttonY}] }}
             >
                <Text style = {{fontSize: 20, fontWidth: 'bold'}}> CREATE ACCOUNT </Text>
            </Animated.View>
          
          </Animatable.View>
 {/* end of signup button that loses opacity and slides down the screen when pressed*/}


{/* login button that loses opacity and slides down the screen when pressed*/}
          <Animatable.View animation={'bounceIn'} delay={1400} duration={2000}>
          <TapGestureHandler onHandlerStateChange={this.loginPress}>
            <Animated.View 
            style = {{...styles.buttons, backgroundColor: 'blue', bottom: 30,
            opacity:this.buttonOpacity, transform:[
              {translateY: this.buttonY}] }}>
                <Text style = {{fontSize: 20, fontWidth: 'bold', color:
                'white'}}>
                 LOG IN </Text>
            </Animated.View>
            </TapGestureHandler> 
            </Animatable.View>
      {/* end of login button that loses opacity and slides down the screen when pressed*/}




{/* what you see after  when you click on the login button*/}
            <Animated.View
             style = {{
               zIndex: this.loginInputZindex,
               opacity:this.loginInputOpacity,
               transform:[{translateY: this.loginInputY}],
               height: height/2,
               ...StyleSheet.absoluteFill, 
               top: null, 
               justifyContent: 'center'
            }}
            >
          {/* X button. when it is pressed you go back to the default settings in the homescreen*/}
            <TapGestureHandler onHandlerStateChange={
              this.onCloseState
            }>
              <Animated.View style = {styles.closeButton}>
                <Animated.Text style = {{
                fontSize:15, 
                transform:[{rotate: concat(this.rotateCross,
                'deg') }]
                  }}
                  >
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler> 
             
             {/* login email and password fields that you see when you press the login button*/}
            
      
     
             <View> 
             <TextInput
              placeholder="EMAIL"
              style = {styles.loginInput}
              placeholderTextColor="white"
              onFocus={()=>this._foucus("email")}
                    />
                    {this.state.typing_email ?
                      this._typing()
                    : null}
              </View>
                             
              <View>  
              <TextInput
              placeholder="PASSWORD"
              style = {styles.loginInput}
              placeholderTextColor="white"
              onFocus={()=>this._foucus("password")}
                    />
                    {this.state.typing_password ?
                      this._typing()
                    : null}
              </View>
              

            



                  <TouchableOpacity
                onPress={()=>this._animation()}>
                  <View style={styles.button_container}>
                        <Animated.View style={[styles.animation,{
                          width
                        }]}>

                          {this.state.enable ?
                            <Text style={styles.textLogin}>LOGIN</Text>
                            :
                            <Animatable.View
                            animation="bounceIn"
                            delay={50}>
                              <FontAwesome 
                                name="check"
                                color="white"
                                size={20}
                              />
                            </Animatable.View>
                          }

                        </Animated.View>
                  </View>
                </TouchableOpacity>

              
                  


           
            </Animated.View>
            {/* end the view that  you see when you click on the login button*/}





    </View>
    </DismissKeyboardView>
    </KeyboardAvoidingView>
   
  );
  }
  }
export default HomeScreenPage;



var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttons: {
      height: 70,
      marginHorizontal: 20,
      borderRadius: 35,
      alignItems: 'center',
      justifyContent:'center',
      marginVertical: 10,
      shadowOffset: {width:2, height: 2},
      shadowColor: 'black',
      shadowOpacity: 0.2,
      

  },

  closeButton: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -20,
    left: width /2 - 20,
    shadowOffset: {width:2, height: 2},
    shadowColor: 'black',
    shadowOpacity: 0.2
  },

  loginInput: {
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    marginHorizontal: 20,
    paddingLeft: 30,
    marginVertical: 5,
    borderColor: 'white',
    color: 'white'

  },

  signupInput: {
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    marginHorizontal: 20,
    paddingLeft: 30,
    marginVertical: 5,
    borderColor: 'white',
    color: 'white',
    top: 20,
    position: 'absolute'

  },

  button_container: {
    alignItems: 'center',
    justifyContent:'center'
  },

  animation: {
    backgroundColor:'#93278f' ,
    paddingVertical:10,
    marginTop:30,
    borderRadius:100,
    justifyContent:'center',
    alignItems:'center'
  },

  textLogin: {
    color:'white',
    fontWeight:'bold',
    fontSize:18
  },
 

});
