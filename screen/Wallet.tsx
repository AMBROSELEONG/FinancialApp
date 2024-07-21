import React, {useEffect, useState} from 'react';
import MainContainer from '../components/MainContainer';
import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, walletCss} from '../objects/commonCss';
import {TabBar, TabView, SceneMap, TabBarProps} from 'react-native-tab-view';
import {DataTable} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';
import WalletIncome from './WalletIncome';
import WalletSpend from './WalletSpend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {darkWallet} from '../objects/darkCss';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';

interface WalletIncomeType {
  walletIncomeID: number;
  walletID: number;
  userID: number;
  amount: number;
  type: string;
  date: string;
}

interface WalletSpendType {
  walletIncomeID: number;
  walletID: number;
  userID: number;
  amount: number;
  type: string;
  date: string;
}

const Wallet = () => {
  const navigation = useNavigation();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: i18n.t('Wallet.Income-History')},
    {key: 'second', title: i18n.t('Wallet.Spend-History')},
  ]);

  type Route = {
    key: string;
    title: string;
  };

  const renderTabBar = (props: TabBarProps<Route>) => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: isDark ? '#fff' : '#000'}}
      inactiveColor="#999999"
      style={{backgroundColor: isDark ? '#202020' : '#fff'}}
      activeColor={isDark ? '#fff' : '#000'}
    />
  );

  const [isDark, setIsDark] = useState(false);
  const [locale, setLocale] = React.useState(i18n.locale);
  const [loading, setLoading] = useState(false);
  const [UserID, setUserId] = useState('');
  const [Balance, setBalance] = useState(null);
  const [WalletID, setWalletID] = useState(null);
  const [items, setItems] = useState<WalletIncomeType[]>([]);
  const [spendItems, setSpendItems] = useState<WalletSpendType[]>([]);

  const ErrorToast = (message: any) => {
    Toast.show({
      type: 'error',
      text1: message,
      visibilityTime: 3000,
    });
  };

  const SuccessToast = (message: any) => {
    Toast.show({
      type: 'success',
      text1: message,
      visibilityTime: 3000,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
      initialize();
    }, []),
  );

  const fetchData = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Wallet/GetWallet?userID=${UserID}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();
      if (json.success) {
        setBalance(json.walletData.balance.toFixed(2));
        AsyncStorage.setItem('WalletID', json.walletData.walletID.toString());
      } else {
        ErrorToast(i18n.t('SettingPage.Failed-Fetch-Data'));
      }
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Error-Fetch'));
    }
  };

  const fetchIncome = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}WalletIncome/GetIncome?userId=${UserID}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();
      setItems(json.data);
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Error-Fetch'));
    }
  };

  const fetchSpend = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}WalletSpend/GetSpend?userId=${UserID}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();
      setSpendItems(json.data);
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Error-Fetch'));
    }
  };

  const initialize = async () => {
    setLoading(true);

    try {
      const [savedTheme, storedUserID, walletID] = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('UserID'),
        AsyncStorage.getItem('WalletID'),
      ]);

      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }

      if (storedUserID) {
        setUserId(storedUserID);
        await fetchData(storedUserID);
        await fetchIncome(storedUserID);
        await fetchSpend(storedUserID);
      }
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Error-Initializing'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const typeMap: Record<string, string> = {
    '1': i18n.t('IncomeType.Type1'),
    '2': i18n.t('IncomeType.Type2'),
    '3': i18n.t('IncomeType.Type3'),
    '4': i18n.t('IncomeType.Type4'),
    '5': i18n.t('IncomeType.Type5'),
    '6': i18n.t('IncomeType.Type6'),
    '7': i18n.t('IncomeType.Type7'),
    '8': i18n.t('IncomeType.Type8'),
    '9': i18n.t('IncomeType.Type9'),
  };

  const typeMapSpend: Record<string, string> = {
    '1': i18n.t('SpendType.Type1'),
    '2': i18n.t('SpendType.Type2'),
    '3': i18n.t('SpendType.Type3'),
    '4': i18n.t('SpendType.Type4'),
    '5': i18n.t('SpendType.Type5'),
    '6': i18n.t('SpendType.Type6'),
    '7': i18n.t('SpendType.Type7'),
    '8': i18n.t('SpendType.Type8'),
    '9': i18n.t('SpendType.Type9'),
    '10': i18n.t('SpendType.Type10'),
    '11': i18n.t('SpendType.Type11'),
    '12': i18n.t('SpendType.Type12'),
    '13': i18n.t('SpendType.Type13'),
  };

  const FirstRoute = () => {
    return (
      <View style={isDark ? darkWallet.TabBackground : walletCss.TabBackground}>
        <ScrollView>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={{color: isDark ? '#fff' : '#000'}}>
                {i18n.t('Wallet.Type')}
              </DataTable.Title>
              <DataTable.Title
                style={walletCss.cell}
                textStyle={{color: isDark ? '#fff' : '#000'}}>
                {i18n.t('Wallet.Income')} (RM)
              </DataTable.Title>
              <DataTable.Title
                style={walletCss.cell}
                textStyle={{color: isDark ? '#fff' : '#000'}}>
                {i18n.t('Wallet.Date')}
              </DataTable.Title>
            </DataTable.Header>

            {items && items.length > 0 ? (
              items.map((item, index) => (
                <DataTable.Row
                  key={item.walletIncomeID}
                  style={
                    index % 2 === 0
                      ? walletCss.evenRowIncome
                      : isDark
                      ? darkWallet.oddRow
                      : walletCss.oddRow
                  }>
                  <DataTable.Cell textStyle={{color: isDark ? '#fff' : '#000'}}>
                    {typeMap[item.type] || item.type}
                  </DataTable.Cell>
                  <DataTable.Cell
                    style={walletCss.cell}
                    textStyle={{color: isDark ? '#fff' : '#000'}}>
                    {item.amount.toFixed(2)}
                  </DataTable.Cell>
                  <DataTable.Cell
                    style={walletCss.cell}
                    textStyle={{color: isDark ? '#fff' : '#000'}}>
                    {item.date}
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell textStyle={{color: isDark ? '#fff' : '#000'}}>
                  No data available
                </DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
        </ScrollView>
      </View>
    );
  };

  const SecondRoute = () => {
    return (
      <View style={isDark ? darkWallet.TabBackground : walletCss.TabBackground}>
        <ScrollView>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={{color: isDark ? '#fff' : '#000'}}>
                {i18n.t('Wallet.Type')}
              </DataTable.Title>
              <DataTable.Title
                style={walletCss.cell}
                textStyle={{color: isDark ? '#fff' : '#000'}}>
                {i18n.t('Wallet.Income')} (RM)
              </DataTable.Title>
              <DataTable.Title
                style={walletCss.cell}
                textStyle={{color: isDark ? '#fff' : '#000'}}>
                {i18n.t('Wallet.Date')}
              </DataTable.Title>
            </DataTable.Header>

            {spendItems && spendItems.length > 0 ? (
              spendItems.map((spendItems, index) => (
                <DataTable.Row
                  key={spendItems.walletIncomeID}
                  style={
                    index % 2 === 0
                      ? walletCss.evenRowSpend
                      : isDark
                      ? darkWallet.oddRow
                      : walletCss.oddRow
                  }>
                  <DataTable.Cell textStyle={{color: isDark ? '#fff' : '#000'}}>
                    {typeMapSpend[spendItems.type] || spendItems.type}
                  </DataTable.Cell>
                  <DataTable.Cell
                    style={walletCss.cell}
                    textStyle={{color: isDark ? '#fff' : '#000'}}>
                    {spendItems.amount.toFixed(2)}
                  </DataTable.Cell>
                  <DataTable.Cell
                    style={walletCss.cell}
                    textStyle={{color: isDark ? '#fff' : '#000'}}>
                    {spendItems.date}
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell textStyle={{color: isDark ? '#fff' : '#000'}}>
                  No data available
                </DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
        </ScrollView>
      </View>
    );
  };

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDark ? '#000' : '#fff',
        }}>
        <ActivityIndicator size="large" color={isDark ? '#fff' : '#000'} />
      </View>
    );
  }

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar
          animated={true}
          backgroundColor={isDark ? '#000' : '#3490DE'}
          barStyle={'dark-content'}
        />
        <View
          style={[
            css.mainView,
            {backgroundColor: isDark ? '#000' : '#3490DE'},
          ]}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <Ionicons name="menu" size={30} color={'#fff'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={[css.PageName, {color: '#fff'}]}>
              {i18n.t('Wallet.Wallet')}
            </Text>
          </View>
        </View>
        <View style={walletCss.container}>
          <View style={isDark ? darkWallet.header : walletCss.header}>
            <Text style={walletCss.balanceText}>
              {i18n.t('Wallet.Balance')}
            </Text>
            <Text style={walletCss.balance}>RM {Balance}</Text>
            <View
              style={
                isDark
                  ? darkWallet.positionContainer
                  : walletCss.positionContainer
              }>
              <TouchableOpacity
                style={walletCss.button}
                onPress={() => navigation.navigate(WalletIncome as never)}>
                <Image
                  source={
                    isDark
                      ? require('../assets/whiteincome.png')
                      : require('../assets/income.png')
                  }
                  style={walletCss.icon}></Image>
                <Text style={isDark ? darkWallet.text : walletCss.text}>
                  {i18n.t('Wallet.Income')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={walletCss.button}
                onPress={() => navigation.navigate(WalletSpend as never)}>
                <Image
                  source={
                    isDark
                      ? require('../assets/whitespend.png')
                      : require('../assets/spend.png')
                  }
                  style={walletCss.icon}></Image>
                <Text style={isDark ? darkWallet.text : walletCss.text}>
                  {i18n.t('Wallet.Spend')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={isDark ? darkWallet.body : walletCss.body}>
            <TabView
              navigationState={{index, routes}}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{width: layout.width}}
              renderTabBar={renderTabBar}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Wallet;
