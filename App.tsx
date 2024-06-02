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
const Stack = createNativeStackNavigator<StackParamList>();

function App(): JSX.Element {
  LogBox.ignoreAllLogs();
  const [otpValue, setOtpValue] = useState<string[]>(Array(6).fill(''));
  useEffect(() => {
    requestUserPermission();
    GetFCMToken();
    AsyncStorage.getItem('Token')
      .then(token => {
        console.log(token);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });

  return (
    <PaperProvider theme={whiteTheme}>
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="SignUp" component={SignUp} />
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
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default App;
