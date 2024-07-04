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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, walletCss} from '../objects/commonCss';
import {TabBar, TabView, SceneMap, TabBarProps} from 'react-native-tab-view';
import {DataTable} from 'react-native-paper';
import BankIncome from './BankIncome';
import BankSpend from './BankSpend';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {darkWallet} from '../objects/darkCss';

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
  const [Balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

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
    }, []),
  );

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      try {
        const [savedTheme] = await Promise.all([
          AsyncStorage.getItem('theme'),
          // AsyncStorage.getItem('UserID'),
        ]);

        if (savedTheme) {
          setIsDark(savedTheme === 'dark');
        }

        // if (storedUserID) {
        //   setUserId(storedUserID);
        //   await fetchData(storedUserID);
        // }
      } catch (error) {
        ErrorToast(i18n.t('SettingPage.Error-Initializing'));
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const FirstRoute = () => {
    const [items] = React.useState([
      {
        key: 1,
        type: 'Cupcake',
        income: 356,
        date: '2021-01-01',
      },
      {
        key: 2,
        type: 'Eclair',
        income: 262,
        date: '2021-01-02',
      },
    ]);

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

            {items.map((item, index) => (
              <DataTable.Row
                key={item.key}
                style={
                  index % 2 === 0
                    ? walletCss.evenRowIncome
                    : isDark
                    ? darkWallet.oddRow
                    : walletCss.oddRow
                }>
                <DataTable.Cell textStyle={{color: isDark ? '#fff' : '#000'}}>
                  {item.type}
                </DataTable.Cell>
                <DataTable.Cell
                  style={walletCss.cell}
                  textStyle={{color: isDark ? '#fff' : '#000'}}>
                  {item.income}
                </DataTable.Cell>
                <DataTable.Cell
                  style={walletCss.cell}
                  textStyle={{color: isDark ? '#fff' : '#000'}}>
                  {item.date}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </ScrollView>
      </View>
    );
  };

  const SecondRoute = () => {
    const [items] = React.useState([
      {
        key: 1,
        type: 'Cupcake',
        income: 356,
        date: '2021-01-01',
      },
      {
        key: 2,
        type: 'Eclair',
        income: 262,
        date: '2021-01-02',
      },
    ]);

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

            {items.map((item, index) => (
              <DataTable.Row
                key={item.key}
                style={
                  index % 2 === 0
                    ? walletCss.evenRowSpend
                    : isDark
                    ? darkWallet.oddRow
                    : walletCss.oddRow
                }>
                <DataTable.Cell textStyle={{color: isDark ? '#fff' : '#000'}}>
                  {item.type}
                </DataTable.Cell>
                <DataTable.Cell
                  style={walletCss.cell}
                  textStyle={{color: isDark ? '#fff' : '#000'}}>
                  {item.income}
                </DataTable.Cell>
                <DataTable.Cell
                  style={walletCss.cell}
                  textStyle={{color: isDark ? '#fff' : '#000'}}>
                  {item.date}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
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
              navigation.goBack();
            }}>
            <Ionicons name="arrow-back" size={30} color={'#fff'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={[css.PageName, {color: '#fff'}]}>Bank</Text>
          </View>
        </View>
        <View style={walletCss.container}>
          <View style={isDark ? darkWallet.header : walletCss.header}>
            <Text style={walletCss.balanceText}>
              {i18n.t('Wallet.Balance')}
            </Text>
            <Text style={walletCss.balance}>RM 100.00</Text>
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
