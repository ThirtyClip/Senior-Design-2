import React, {useEffect} from "react";
import { 
  StyleSheet,
  BackHandler,
  View, } from 'react-native';
import Onboarding from './Onboarding';
import LoginScreen from './loginScreen';
import SignUp from './signUp';
import ProfileScreen from './profile';
import TechnologyBased from './technologyBased';
import HumanBased from './humanBased';
import CyberSecurity from './cybersecurity';
import HomeScreen from './homeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CyberProfile from './cyberProfile';
import AttackProfile from './attackProf';
import TestMe from './test';
import CaseStudy from './caseStudy';
import RealExamples from './realExamples';
import AnalyticsScreen from './analytics';
import GroupChat from './GroupChat';
import GroupChatWindow  from './GroupChatWindow';
import MessageInput from './MessageInput';
import GroupDiscussionScreen from './GroupDiscussionScreen';

const Stack =  createNativeStackNavigator();

export default function App({}) {

  const screenOptions = {
    gestureEnabled: false,
    headerTintColor: 'white',
    headerTitleStyle: { color: 'white', fontWeight: 'bold' },
    headerStyle: { backgroundColor: 'black' },
  };

  const androidBackButton = () => {
    BackHandler.exitApp();
    return true;
  }

  useEffect(() => {
 
    BackHandler.addEventListener('hardwareBackPress', androidBackButton);
  

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', androidBackButton); // to handle android back button so that it exits out of the app when pressed
    };

    
  }, []);
  
<h1> Hello </h1>  


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={Home} options={{ ...screenOptions, title: 'Home', headerBackVisible: true }} />
        <Stack.Screen name="Cybersecurity" component={Cybersecurity} options={{ ...screenOptions, title: 'Learn' }} />
        <Stack.Screen name="CybersecurityProfile" component={CybersecurityProfile} options={{ ...screenOptions, title: 'Social Engineering' }} />
        <Stack.Screen name="HumanBasedd" component={HumanBasedd} options={{ ...screenOptions, title: 'Human Based Attacks' }} />
        <Stack.Screen name="Technologybased" component={Technologybased} options={{ ...screenOptions, title: 'Technology Based Attacks' }} />
        <Stack.Screen name="Attackprofile" component={Attackprofile} options={{ ...screenOptions, title: 'Social Engineering Attacks' }} />
        <Stack.Screen name="AllAttacks" component={AllAttacks} options={{ ...screenOptions, title: 'Social Engineering Attacks' }} />
        <Stack.Screen name="Login" component={Login} options={{ ...screenOptions, title: 'Login' }} />
        <Stack.Screen name="Signup" component={Signup} options={{ ...screenOptions, title: 'Register' }} />
        <Stack.Screen name="Profile" component={Profile} options={{ ...screenOptions, title: 'Profile' }} />
        <Stack.Screen name="Testme" component={Testme} options={{ ...screenOptions, title: 'Quiz' }} />
        <Stack.Screen name="Casestudy" component={Casestudy} options={{ ...screenOptions, title: 'Case Study' }} />
        <Stack.Screen name="Examples" component={Examples} options={{ ...screenOptions, title: 'Real Life Examples' }} />
        <Stack.Screen name="Analytics" component={Analytics} options={{ ...screenOptions, title: 'Analytics' }} />
	<Stack.Screen name="Group Discussion" component={GroupDiscussionScreen} options={{ ...screenOptions, title: 'Group Discussion'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
}

function Analytics() {
  return (
    <View>
      <AnalyticsScreen/>
    </View>
  )
}

function Login() {
  return (
    <View>
      <LoginScreen/>
    </View>
  );
}

function Signup() {
  return (
    <View>
      <SignUp/>
    </View>
  );
}

function Examples() {
  return (
    <View>
      <RealExamples/>
    </View>
  )
}

function Profile()
{
  return(
    <View>
      <ProfileScreen/>
    </View>
  );
}

function Home() {
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#121212'}]}>
      <HomeScreen/>
    </View>
  );
}

function Cybersecurity()
{
  return(
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#121212'}]}>
    <CyberSecurity/>
   </View>
  );
}

function HumanBasedd() {
  return(
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#121212'}]}>
      <HumanBased/>
    </View>
  );
}

function Technologybased() {
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#121212'}]}>
       <TechnologyBased/>
       </View>
  );
}

function AllAttacks() 
{
  return(
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#121212'}]}>
     <Onboarding/>
    </View>
  );
}

function CybersecurityProfile()
{
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#121212'}]}>
      <CyberProfile/>
    </View>
  )
}


function Attackprofile({ navigation , route}) {
  return(
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#121212'}]}>
      <AttackProfile/>
    </View>
  )
}

function Testme({ navigation , route}) {
  return(
      <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#121212'}]}>
      <TestMe/>
      </View>
  )
}

function Casestudy({}){
  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#121212'}]}>
      <CaseStudy/>
    </View>
  )
}

function GroupDiscussion(){
	return ( 
		<View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#121212'}]}>
      <GroupDiscussion/>
		</View>
	);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listArea: {
    flex: 1,
    width: "100%"
  },
  attackList: 
  {
    backgroundColor: 'rgba(255,255,255,.10)',
    padding: 10, 
    margin: 0, 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 5
  },
});
