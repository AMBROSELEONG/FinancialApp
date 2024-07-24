import {
  View,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import {TabBar, TabView, SceneMap, TabBarProps} from 'react-native-tab-view';
import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
} from '@react-navigation/native';
import i18n from '../language/language';
import React, {useEffect, useState} from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import {DataTable} from 'react-native-paper';
import {darkCss, darkWallet} from '../objects/darkCss';
import {css, walletCss} from '../objects/commonCss';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface EWalletIncomeType {
  ewalletIncomeID: number;
  ewalletID: number;
  userID: number;
  amount: number;
  type: string;
  date: string;
}

interface EWalletSpendType {
  ewalletIncomeID: number;
  ewalletID: number;
  userID: number;
  amount: number;
  type: string;
  date: string;
}
const EwalletHistory = () => {
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
  const [items, setItems] = useState<EWalletIncomeType[]>([]);
  const [spendItems, setSpendItems] = useState<EWalletSpendType[]>([]);

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

  const fetchIncome = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}EwalletIncome/GetIncome?userId=${UserID}`,
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
        `${UrlAccess.Url}EwalletSpend/GetSpend?userId=${UserID}`,
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
      const [savedTheme, storedUserID] = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('UserID'),
      ]);

      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }

      if (storedUserID) {
        setUserId(storedUserID);
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
                  key={item.ewalletIncomeID}
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
                  key={spendItems.ewalletIncomeID}
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
          backgroundColor={isDark ? '#000' : '#fff'}
          barStyle={'dark-content'}
        />
        <View style={isDark ? darkCss.mainView : css.mainView}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Ionicons
              name="arrow-back"
              size={30}
              color={isDark ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={isDark ? darkCss.PageName : css.PageName}>
              {i18n.t('Wallet.History')}
            </Text>
          </View>
        </View>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
          renderTabBar={renderTabBar}
        />
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default EwalletHistory;
