import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  useNavigation,
  CommonActions,
  useFocusEffect,
} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Dimensions, Image, Text, View, BackHandler} from 'react-native';
import {customCss} from '../objects/commonCss';
import Setting from './Setting';
import CustomBottomTabNavigator from './BottomNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../language/language';

const Drawer = createDrawerNavigator();
const STORAGE_KEY = '@app_language';

function CustomDrawerContent(props: any) {
  const navigation = useNavigation();
  const [loggedOut, setLoggedOut] = React.useState(false);
  const [locale, setLocale] = React.useState(i18n.locale);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

  const handleLogout = () => {
    setLoggedOut(true);
    AsyncStorage.removeItem('UserID');
    AsyncStorage.removeItem('UserName');
    AsyncStorage.removeItem('Email');
    AsyncStorage.removeItem('Password');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Welcome'}],
      }),
    );
  };

  return (
    <View style={{height: (Dimensions.get('screen').height / 100) * 93}}>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 10,
        }}>
        <Image
          source={require('../assets/LogoIcon.png')}
          style={{
            flex: 1,
            height: (Dimensions.get('screen').height / 100) * 8,
            resizeMode: 'contain',
            alignSelf: 'center',
          }}
        />
        <Text style={customCss.header}>My Financial</Text>
      </View>
      <DrawerContentScrollView contentContainerStyle={{flex: 1}} {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label={i18n.t('CustomDrawer.Logout')}
          onPress={handleLogout}
          icon={() => (
            <Ionicons
              name="log-out-sharp"
              size={35}
              color="black"
              style={{marginLeft: 5, marginRight: 5}}
            />
          )}
        />
      </DrawerContentScrollView>
    </View>
  );
}

export function CustomDrawer() {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        AsyncStorage.removeItem('UserID');
        AsyncStorage.removeItem('UserName');
        AsyncStorage.removeItem('Email');
        AsyncStorage.removeItem('Password');
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Welcome'}],
          }),
        );
        return true; 
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation]),
  );
  return (
    <Drawer.Navigator
      initialRouteName={i18n.t('CustomDrawer.Home')}
      screenOptions={{
        headerShown: false,
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTitleStyle: {color: '#FFF'},
        headerTintColor: '#fff',
        headerTitleAlign: 'left',
        drawerActiveBackgroundColor: '#3490DE',
        drawerActiveTintColor: '#fff',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name={i18n.t('CustomDrawer.Home')}
        component={CustomBottomTabNavigator}
        options={{
          headerTitle: 'Home',
          headerRight: () => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}></View>
          ),
          drawerIcon: ({focused, size}) => (
            <Ionicons
              name="home"
              size={35}
              color={focused ? '#fff' : 'black'}
              style={{marginLeft: 5, marginRight: 5}}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={i18n.t('CustomDrawer.Setting')}
        component={Setting}
        options={{
          headerTitle: 'Setting',
          headerRight: () => (
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}></View>
          ),
          drawerIcon: ({focused, size}) => (
            <Ionicons
              name="settings"
              size={35}
              color={focused ? '#fff' : 'black'}
              style={{marginLeft: 5, marginRight: 5}}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
export default CustomDrawer;
