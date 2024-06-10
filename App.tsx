import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LogBox, SafeAreaView} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import Welcome from './screen/Welcome';
import whiteTheme from './objects/commonCss';
import SignIn from './screen/SignIn';
import SignUp from './screen/SignUp';
import Verify from './screen/Verify';
import {StackParamList} from './screen/StackPatamList';
import {
  requestUserPermission,
  GetFCMToken,
} from './components/pushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForgotPassword from './screen/ForgotPassword';
import ResetPassword from './screen/ResetPassword';
import CustomDrawer from './screen/CustomDrawer';
import Home from './screen/Home';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Setting from './screen/Setting';
import CustomBottomTabNavigator from './screen/BottomNavigation';
import Wallet from './screen/Wallet';
import Bank from './screen/Bank';
import Ewallet from './screen/Ewallet';
import Expenses from './screen/Expenses';
import ResetVerify from './screen/ResetVerify';

const Stack = createNativeStackNavigator<StackParamList>();
const Drawer = createDrawerNavigator();

function App(): JSX.Element {
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(''));

  useEffect(() => {
    LogBox.ignoreAllLogs();
    requestUserPermission();
    GetFCMToken();
    AsyncStorage.getItem('Token')
      .then(token => {
        console.log(token);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <PaperProvider theme={whiteTheme}>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="CustomDrawer"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
            <Stack.Screen name="Verify">
              {props => (
                <Verify
                  {...props}
                  length={6}
                  value={otpValue}
                  disabled={false}
                  onChange={setOtpValue}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="ResetVerify">
              {props => (
                <ResetVerify
                  {...props}
                  length={6}
                  value={otpValue}
                  disabled={false}
                  onChange={setOtpValue}
                />
              )}
            </Stack.Screen>
            <Stack.Group screenOptions={{navigationBarColor: 'white'}}>
              <Stack.Screen name="CustomDrawer" component={CustomDrawer} />
              <Stack.Screen
                name="CustomBottomTabNavigator"
                component={CustomBottomTabNavigator}
              />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Setting" component={Setting} />
              <Stack.Screen name="Wallet" component={Wallet} />
              <Stack.Screen name="Bank" component={Bank} />
              <Stack.Screen name="Ewallet" component={Ewallet} />
              <Stack.Screen name="Expenses" component={Expenses} />
            </Stack.Group>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default App;
