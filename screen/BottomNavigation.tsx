import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Home from './Home';
import Wallet from './Wallet';
import {Image} from 'react-native';
import Bank from './Bank';
import Ewallet from './Ewallet';
import Expenses from './Expenses';

const Tab = createMaterialBottomTabNavigator();

function CustomBottomTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      shifting={false}
      activeColor="#000000"
      activeIndicatorStyle={{
        backgroundColor: 'transparent'
      }}
      inactiveColor="#999999"
      barStyle={{
        backgroundColor: '#F9F9F9',
        borderTopWidth: 1,
        borderTopColor: '#e6e6e6',
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Home',
          tabBarIcon: 'home',
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          title: 'Wallet',
          tabBarIcon: ({color, focused}) => (
            <Image 
            source={
                focused
                  ? require('../assets/wallet-active.png')
                  : require('../assets/wallet.png')
              }
              style={{ tintColor: color, width: 22, height: 22 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Bank"
        component={Bank}
        options={{
          title: 'Bank',
          tabBarIcon: ({color, focused}) => (
            <Image 
            source={
                focused
                  ? require('../assets/Bank-active.png')
                  : require('../assets/Bank.png')
              }
              style={{ tintColor: color, width: 22, height: 22 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Ewallet"
        component={Ewallet}
        options={{
          title: 'E-Wallet',
          tabBarIcon: ({color, focused}) => (
            <Image 
            source={
                focused
                  ? require('../assets/Ewallet-active.png')
                  : require('../assets/Ewallet.png')
              }
              style={{ tintColor: color, width: 22, height: 22 }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={Expenses}
        options={{
          title: 'Expenses',
          tabBarIcon: ({color, focused}) => (
            <Image 
            source={
                focused
                  ? require('../assets/Debt-active.png')
                  : require('../assets/Debt.png')
              }
              style={{ tintColor: color, width: 22, height: 22 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default CustomBottomTabNavigator;
