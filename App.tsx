import React, {useEffect, useState, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {LogBox, SafeAreaView} from 'react-native';
import {PaperProvider, ProgressBar} from 'react-native-paper';
import Welcome from './screen/Welcome';
import whiteTheme from './objects/commonCss';
import darkTheme from './objects/darkCss';
import SignIn from './screen/SignIn';
import SignUp from './screen/SignUp';
import Verify from './screen/Verify';
import {StackParamList} from './screen/StackPatamList';
import {
  GetFCMToken,
  requestUserPermission,
} from './components/pushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForgotPassword from './screen/ForgotPassword';
import ResetPassword from './screen/ResetPassword';
import CustomDrawer from './screen/CustomDrawer';
import Home from './screen/Home';
import Setting from './screen/Setting';
import CustomBottomTabNavigator from './screen/BottomNavigation';
import Wallet from './screen/Wallet';
import Bank from './screen/Bank';
import Ewallet from './screen/Ewallet';
import Expenses from './screen/Expenses';
import ResetVerify from './screen/ResetVerify';
import Language from './screen/Language';
import UserEdit from './screen/UserEdit';
import WalletIncome from './screen/WalletIncome';
import WalletSpend from './screen/WalletSpend';
import EWalletIncome from './screen/EWalletIncome';
import EWalletSpend from './screen/EWalletSpend';
import BankDetail from './screen/BankDetail';
import BankIncome from './screen/BankIncome';
import BankSpend from './screen/BankSpend';
import UserEditVerify from './screen/UserEditVerify';
import Toast from 'react-native-toast-message';
import {ThemeProvider} from './objects/ThemeProvider';
import ThemeChange from './screen/ThemeChange';
import messaging from '@react-native-firebase/messaging';
import WalletHistory from './screen/WalletHistory';
import EwalletHistory from './screen/EwalletHistory';
import BankHistory from './screen/BankHistory';

const Stack = createNativeStackNavigator<StackParamList>();

function App(): JSX.Element {
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(''));
  const [Token, setToken] = useState('');

  useEffect(() => {
    LogBox.ignoreAllLogs();
    requestUserPermission();
    GetFCMToken();
    AsyncStorage.getItem('Token').then(token => {
      if (token !== null) {
        setToken(token);
        if (Token !== null) {
          AsyncStorage.setItem('Token', Token);
        }
      }
    });
  }, []);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    })();
  }, []);

  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  return (
    <PaperProvider theme={isDark ? whiteTheme : darkTheme}>
      <SafeAreaView style={{flex: 1}}>
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Welcome"
              screenOptions={{
                headerShown: false,
                gestureDirection: 'horizontal',
              }}>
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
                <Stack.Screen name="WalletIncome" component={WalletIncome} />
                <Stack.Screen name="WalletSpend" component={WalletSpend} />
                <Stack.Screen name="WalletHistory" component={WalletHistory} />
                <Stack.Screen name="Bank" component={Bank} />
                <Stack.Screen name="BankDetail" component={BankDetail} />
                <Stack.Screen name="BankIncome" component={BankIncome} />
                <Stack.Screen name="BankSpend" component={BankSpend} />
                <Stack.Screen name="BankHistory" component={BankHistory} />
                <Stack.Screen name="Ewallet" component={Ewallet} />
                <Stack.Screen name="EWalletIncome" component={EWalletIncome} />
                <Stack.Screen name="EWalletSpend" component={EWalletSpend} />
                <Stack.Screen name="EwalletHistory" component={EwalletHistory} />
                <Stack.Screen name="Expenses" component={Expenses} />
                <Stack.Screen name="Language" component={Language} />
                <Stack.Screen name="UserEdit" component={UserEdit} />
                <Stack.Screen name="ThemeChange" component={ThemeChange} />
                <Stack.Screen name="UserEditVerify">
                  {props => (
                    <UserEditVerify
                      {...props}
                      length={6}
                      value={otpValue}
                      disabled={false}
                      onChange={setOtpValue}
                    />
                  )}
                </Stack.Screen>
              </Stack.Group>
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
        <Toast />
      </SafeAreaView>
    </PaperProvider>
  );
}

export default App;
