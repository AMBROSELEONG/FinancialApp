import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';

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
      AsyncStorage.setItem('Token', FCMToken);
    }
  } catch (error) {
    console.log(error);
  }
}
