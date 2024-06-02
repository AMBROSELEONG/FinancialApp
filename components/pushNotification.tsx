import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export async function GetFCMToken() {
  try {
    const FCMToken = await messaging().getToken();
    if (FCMToken) {
      await AsyncStorage.setItem('Token', FCMToken);
      console.log(FCMToken)
    }
  } catch (error) {
    console.log(error);
  }
}
