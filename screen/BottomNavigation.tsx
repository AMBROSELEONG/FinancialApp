import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Home from './Home';
import Wallet from './Wallet';
import {Image, View, ActivityIndicator} from 'react-native';
import Bank from './Bank';
import Ewallet from './Ewallet';
import Expenses from './Expenses';
import i18n from '../language/language';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createMaterialBottomTabNavigator();

function CustomBottomTabNavigator() {
  const [locale, setLocale] = React.useState(i18n.locale);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

  const [isDark, setIsDark] = useState(false);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Failed to load theme', error);
    }
  };

  const initialize = async () => {
    setLoading(true);
    try {
      await Promise.all([loadTheme()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  // if (loading) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         backgroundColor: isDark ? '#000' : '#fff',
  //       }}>
  //       <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
  //     </View>
  //   );
  // }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      shifting={false}
      activeColor={isDark ? '#fff' : '#000000'}
      activeIndicatorStyle={{
        backgroundColor: 'transparent',
      }}
      inactiveColor="#999999"
      barStyle={{
        backgroundColor: isDark ? '#000' : '#F9F9F9',
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: i18n.t('BottomNavigation.Home'),
          tabBarIcon: 'home',
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          title: i18n.t('BottomNavigation.Wallet'),
          tabBarIcon: ({color, focused}) => (
            <Image
              source={
                focused
                  ? require('../assets/wallet-active.png')
                  : require('../assets/wallet.png')
              }
              style={{tintColor: color, width: 22, height: 22}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bank"
        component={Bank}
        options={{
          title: i18n.t('BottomNavigation.Bank'),
          tabBarIcon: ({color, focused}) => (
            <Image
              source={
                focused
                  ? require('../assets/Bank-active.png')
                  : require('../assets/Bank.png')
              }
              style={{tintColor: color, width: 22, height: 22}}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Ewallet"
        component={Ewallet}
        options={{
          title: i18n.t('BottomNavigation.E-Wallet'),
          tabBarIcon: ({color, focused}) => (
            <Image
              source={
                focused
                  ? require('../assets/Ewallet-active.png')
                  : require('../assets/Ewallet.png')
              }
              style={{tintColor: color, width: 22, height: 22}}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Expenses"
        component={Expenses}
        options={{
          title: i18n.t('BottomNavigation.Expenses'),
          tabBarIcon: ({color, focused}) => (
            <Image
              source={
                focused
                  ? require('../assets/Debt-active.png')
                  : require('../assets/Debt.png')
              }
              style={{tintColor: color, width: 22, height: 22}}
            />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

export default CustomBottomTabNavigator;
