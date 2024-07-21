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
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {css, walletCss} from '../objects/commonCss';
import {TabBar, TabView, SceneMap, TabBarProps} from 'react-native-tab-view';
import {DataTable} from 'react-native-paper';
import BankIncome from './BankIncome';
import BankSpend from './BankSpend';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {darkWallet} from '../objects/darkCss';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';

interface BankIncomeType {
  bankIncomeID: number;
  bankID: number;
  userID: number;
  amount: number;
  type: string;
  date: string;
}

interface BankSpendType {
  bankSpendID: number;
  bankID: number;
  userID: number;
  amount: number;
  type: string;
  date: string;
}

const BankDetail = () => {
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
  const [UserID, setUserId] = useState('');
  const [bankName, setBankName] = useState('');
  const [Balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bankID, setBankID] = useState('');
  const [incomeItems, setIncomeItems] = useState<BankIncomeType[]>([]);
  const [spendItems, setSpendItems] = useState<BankSpendType[]>([]);

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
      const onBackPress = () => {
        AsyncStorage.removeItem('BankID');
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation]),
  );

  const handleDelete = () => {
    Alert.alert(
      i18n.t('Bank.Warning'),
      i18n.t('Bank.Alert'),
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deleteData()},
      ],
      {cancelable: false},
    );
  };

  const deleteData = async () => {
    setLoading(true);
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'DELETE',
        `${UrlAccess.Url}Bank/DeleteBank?bankId=${bankID}`,
        {'Content-Type': 'application/json'},
      );

      const json = await response.json();

      if (json.success) {
        SuccessToast(i18n.t('Bank.Delete-Bank-Success'));
        navigation.goBack();
      } else {
        ErrorToast(i18n.t('Bank.Delete-Bank-Failed'));
      }
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Error-Fetch'));
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (bankId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Bank/GetBanksByBankID?bankId=${bankId}`,
        {'Content-Type': 'application/json'},
      );

      const json = await response.json();

      if (json.success) {
        setBankName(json.data.bankName);
        setBalance(json.data.amount.toFixed(2));
      } else {
        ErrorToast(i18n.t('SettingPage.Failed-Fetch-Data'));
      }
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Error-Fetch'));
    }
  };

  const fetchIncome = async (bankId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}BankIncome/GetIncome?bankId=${bankId}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();
      setIncomeItems(json.data);
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Error-Fetch'));
    }
  };

  const fetchSpend = async (bankId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}BankSpend/GetSpend?bankId=${bankId}`,
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
      const [savedTheme, storedBankID, storedUserID] = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('BankID'),
        AsyncStorage.getItem('UserID'),
      ]);

      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }

      if (storedBankID) {
        setBankID(storedBankID);
        await fetchData(storedBankID);
        await fetchIncome(storedBankID);
        await fetchSpend(storedBankID);
      }

      if (storedUserID) {
        setUserId(storedUserID);
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
    '10': i18n.t('IncomeType.Type10'),
    '11': i18n.t('IncomeType.Type11'),
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
    '14': i18n.t('SpendType.Type14'),
    '15': i18n.t('SpendType.Type15'),
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

            {incomeItems && incomeItems.length > 0 ? (
              incomeItems.map((item, index) => (
                <DataTable.Row
                  key={item.bankIncomeID}
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
              spendItems.map((item, index) => (
                <DataTable.Row
                  key={item.bankSpendID}
                  style={
                    index % 2 === 0
                      ? walletCss.evenRowSpend
                      : isDark
                      ? darkWallet.oddRow
                      : walletCss.oddRow
                  }>
                  <DataTable.Cell textStyle={{color: isDark ? '#fff' : '#000'}}>
                    {typeMapSpend[item.type] || item.type}
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
              navigation.goBack(), AsyncStorage.removeItem('BankID');
            }}>
            <Ionicons name="arrow-back" size={30} color={'#fff'} />
          </TouchableOpacity>
          <View style={[css.HeaderView, {marginRight: 0}]}>
            <Text style={[css.PageName, {color: '#fff'}]}>
              {bankName.substring(0, 20)}
            </Text>
          </View>
          <TouchableOpacity
            style={{paddingLeft: 20, marginRight: 20}}
            onPress={() => handleDelete()}>
            <MaterialCommunityIcons name="delete" size={30} color={'#fff'} />
          </TouchableOpacity>
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
                onPress={() => navigation.navigate(BankIncome as never)}>
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
                onPress={() => navigation.navigate(BankSpend as never)}>
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

export default BankDetail;
