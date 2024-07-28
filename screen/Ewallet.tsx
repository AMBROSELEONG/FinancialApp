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
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, walletStyle} from '../objects/commonCss';
import {ScrollView} from 'react-native-gesture-handler';
import EWalletIncome from './EWalletIncome';
import EWalletSpend from './EWalletSpend';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import {PieChart, LineChart} from 'react-native-gifted-charts';
import EwalletHistory from './EwalletHistory';
import LinearGradient from 'react-native-linear-gradient';

interface ChartData {
  value: number;
  label: string;
}

interface IncomeData {
  date: string;
  totalSpend: number;
}

const Ewallet = () => {
  const navigation = useNavigation();

  const [isDark, setIsDark] = useState(false);
  const [locale, setLocale] = React.useState(i18n.locale);
  const [loading, setLoading] = useState(false);
  const [UserID, setUserId] = useState('');
  const [Balance, setBalance] = useState(null);
  const [maxIncomeType, setMaxIncomeType] = useState('');
  const [maxIncomeAmount, setMaxIncomeAmount] = useState(0);
  const [maxIncomeRatio, setMaxIncomeRatio] = useState(0);
  const [incomeData, setIncomeData] = useState<ChartData[]>([]);
  const [maxSpendType, setMaxSpendType] = useState('');
  const [maxSpendAmount, setMaxSpendAmount] = useState(0);
  const [maxSpendRatio, setMaxSpendRatio] = useState(0);
  const [spendData, setSpendData] = useState<ChartData[]>([]);

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
        `${UrlAccess.Url}Ewallet/GetEwallet?userID=${UserID}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();
      if (json.success) {
        setBalance(json.ewalletData.balance.toFixed(2));
        AsyncStorage.setItem(
          'EwalletID',
          json.ewalletData.ewalletID.toString(),
        );
      }
    } catch (error) {
    }
  };

  const fetchIncomeCategory = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}EwalletIncome/GetUserWeeklyIncomeTypeRatio?userId=${UserID}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();
      if (json.success) {
        setMaxIncomeType(json.maxType);
        setMaxIncomeAmount(json.maxTypeAmount);
        setMaxIncomeRatio(json.ratio);
      }
    } catch (error) {
    }
  };

  const fetchSpendCategory = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}EwalletSpend/GetUserWeeklySpendTypeRatio?userId=${UserID}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();
      if (json.success) {
        setMaxSpendType(json.maxType);
        setMaxSpendAmount(json.maxTypeAmount);
        setMaxSpendRatio(json.ratio);
      }
    } catch (error) {
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  };

  const Income = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}EwalletIncome/WeeklyIncome?userId=${UserID}`,
        {'Content-Type': 'application/json'},
      );
      const result = await response.json();
      if (result.success) {
        const resultData: ChartData[] = result.data.map((item: IncomeData) => {
          return {
            value: item.totalSpend,
            label: formatDate(item.date),
          };
        });
        setIncomeData(resultData);
      }
    } catch (error) {
    }
  };

  const Spend = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}EwalletSpend/WeeklySpend?userId=${UserID}`,
        {'Content-Type': 'application/json'},
      );
      const result = await response.json();
      if (result.success) {
        const resultData: ChartData[] = result.data.map((item: IncomeData) => {
          return {
            value: item.totalSpend,
            label: formatDate(item.date),
          };
        });
        setSpendData(resultData);
      }
    } catch (error) {
    }
  };

  const [percent, setPercent] = useState('');

  const fetchTotalBalance = async (userId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Ewallet/GetTotalBalance?userID=${userId}`,
        {'Content-Type': 'application/json'},
      );

      const result = await response.json();

      if (result.success) {
        setPercent(result.total.ewalletPercentage.toFixed(0));
      }
    } catch (error) {
      ErrorToast(error);
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
        await fetchData(storedUserID);
        await fetchIncomeCategory(storedUserID);
        await fetchSpendCategory(storedUserID);
        await Income(storedUserID);
        await Spend(storedUserID);
        await fetchTotalBalance(storedUserID);
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

  const IncomeCategoryPercent = maxIncomeRatio * 100;
  const remainIncomeCategory = 100 - IncomeCategoryPercent;
  const IncomeCategoryPie = [
    {value: IncomeCategoryPercent, color: '#3490DE'},
    {value: remainIncomeCategory, color: '#fff'},
  ];

  const SpendCategoryPercent = maxSpendRatio * 100;
  const remainSpendCategory = 100 - SpendCategoryPercent;
  const SpendCategoryPie = [
    {value: SpendCategoryPercent, color: '#FF2D00'},
    {value: remainSpendCategory, color: '#fff'},
  ];

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar
          animated={true}
          backgroundColor={isDark ? '#000' : '#F4F4F4'}
          barStyle={'dark-content'}
        />
        <View
          style={[
            css.mainView,
            {backgroundColor: isDark ? '#000' : '#F4F4F4'},
          ]}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <Ionicons name="menu" size={30} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={[css.PageName, {color: isDark ? '#fff' : '#000'}]}>
              {i18n.t('Ewallet.Ewallet')}
            </Text>
          </View>
        </View>
        <View
          style={[
            walletStyle.upperContainer,
            {backgroundColor: isDark ? '#202020' : '#f4f4f4'},
          ]}>
          <View style={walletStyle.leftContent}>
            <View
              style={[
                walletStyle.grayView,
                walletStyle.view,
                walletStyle.rotate45,
                {backgroundColor: isDark ? '#313131' : '#E8E8E8'},
              ]}></View>
            <View
              style={[
                walletStyle.grayView,
                walletStyle.view,
                walletStyle.rotateMinus45,
                {backgroundColor: isDark ? '#313131' : '#E8E8E8'},
              ]}></View>
            <LinearGradient
              style={walletStyle.view}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              colors={['#1C4E78', '#3490DE']}>
              <Text style={walletStyle.balanceText}>RM {Balance}</Text>
              <Text style={walletStyle.title}>{i18n.t('Wallet.Balance')}</Text>
              <Text style={walletStyle.asset}>
                {percent}% {i18n.t('Wallet.Assets')}
              </Text>
            </LinearGradient>
          </View>
          <View style={walletStyle.rightContent}>
            <TouchableOpacity
              style={walletStyle.buttonView}
              onPress={() => navigation.navigate(EWalletIncome as never)}>
              <View
                style={[
                  walletStyle.circle,
                  {backgroundColor: isDark ? '#313131' : '#fff'},
                ]}>
                <Image
                  source={require('../assets/income.png')}
                  style={walletStyle.icon}
                />
              </View>
              <Text style={[walletStyle.buttonText,{color: isDark? '#fff' : '#000'}]}>
                {i18n.t('Wallet.Income')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={walletStyle.buttonView}
              onPress={() => navigation.navigate(EWalletSpend as never)}>
              <View
                style={[
                  walletStyle.circle,
                  {backgroundColor: isDark ? '#313131' : '#fff'},
                ]}>
                <Image
                  source={require('../assets/spending.png')}
                  style={walletStyle.icon}
                />
              </View>
              <Text style={[walletStyle.buttonText,{color: isDark? '#fff' : '#000'}]}>
                {i18n.t('Wallet.Spend')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={walletStyle.buttonView}
              onPress={() => navigation.navigate(EwalletHistory as never)}>
              <View
                style={[
                  walletStyle.circle,
                  {backgroundColor: isDark ? '#313131' : '#fff'},
                ]}>
                <Image
                  source={require('../assets/history.png')}
                  style={walletStyle.icon}
                />
              </View>
              <Text style={[walletStyle.buttonText,{color: isDark? '#fff' : '#000'}]}>
                {i18n.t('Wallet.History')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[
            walletStyle.lowerContainer,
            {backgroundColor: isDark ? '#202020' : '#f4f4f4'},
          ]}>
          <ScrollView>
            <Text
              style={[
                walletStyle.lowerTitle,
                {color: isDark ? '#fff' : '#000'},
              ]}>
              {i18n.t('Wallet.Detail')}
            </Text>
            <View
              style={[
                walletStyle.lowerContent,
                {backgroundColor: isDark ? '#313131' : '#fff'},
              ]}>
              <View style={{flex: 2}}>
                <Text style={walletStyle.lowerText}>
                  {i18n.t('Wallet.Highest-Income')}
                </Text>
                <Text
                  style={[
                    walletStyle.lowerSubtext,
                    {color: isDark ? '#fff' : '#000'},
                  ]}>
                  {typeMap[maxIncomeType] || maxIncomeType}
                </Text>
                <Text style={walletStyle.lowerSubtext2}>
                  {IncomeCategoryPercent.toFixed(0)}%{' '}
                  {i18n.t('Wallet.Income-Comes')}{' '}
                  {typeMap[maxIncomeType] || maxIncomeType}.
                </Text>
              </View>
              <View style={{flex: 1}}>
                <PieChart
                  donut
                  innerRadius={35}
                  data={IncomeCategoryPie}
                  innerCircleColor={isDark ? '#313131' : '#fff'}
                  centerLabelComponent={() => {
                    return (
                      <Text
                        style={{
                          fontSize: 20,
                          color: isDark ? '#fff' : '#000',
                          fontWeight: 'bold',
                        }}>
                        {IncomeCategoryPercent.toFixed(0)}%
                      </Text>
                    );
                  }}
                  radius={45}
                />
              </View>
            </View>
            <View
              style={[
                walletStyle.lowerContent,
                {backgroundColor: isDark ? '#313131' : '#fff'},
              ]}>
              <View style={{flex: 2}}>
                <Text style={walletStyle.lowerText}>
                  {i18n.t('Wallet.Highest-Spend')}
                </Text>
                <Text
                  style={[
                    walletStyle.lowerSubtext,
                    {color: isDark ? '#fff' : '#000'},
                  ]}>
                  {typeMapSpend[maxSpendType] || maxSpendType}
                </Text>
                <Text style={walletStyle.lowerSubtext2}>
                  {SpendCategoryPercent.toFixed(0)}%{' '}
                  {i18n.t('Wallet.Spend-Comes')}{' '}
                  {typeMapSpend[maxSpendType] || maxSpendType}.
                </Text>
              </View>
              <View style={{flex: 1}}>
                <PieChart
                  donut
                  innerRadius={35}
                  data={SpendCategoryPie}
                  innerCircleColor={isDark ? '#313131' : '#fff'}
                  centerLabelComponent={() => {
                    return (
                      <Text
                        style={{
                          fontSize: 20,
                          color: isDark ? '#fff' : '#000',
                          fontWeight: 'bold',
                        }}>
                        {SpendCategoryPercent.toFixed(0)}%
                      </Text>
                    );
                  }}
                  radius={45}
                />
              </View>
            </View>
            <Text
              style={[
                walletStyle.lowerTitle,
                {marginTop: 20, color: isDark ? '#fff' : '#000'},
              ]}>
              {i18n.t('Wallet.Weekly-Income')}
            </Text>
            <View
              style={[
                walletStyle.lowerContent2,
                {backgroundColor: isDark ? '#313131' : '#fff'},
              ]}>
              <LineChart
                areaChart
                hideDataPoints
                hideRules
                isAnimated
                animationDuration={1200}
                startFillColor="#3490DE"
                endFillColor="#8BC4F5"
                startOpacity={1}
                endOpacity={0.1}
                data={incomeData}
                color="#3490DE"
                yAxisTextStyle={{color: isDark ? '#fff' : '#000'}}
                xAxisLabelTextStyle={{color: isDark ? '#fff' : '#000'}}
                curved
              />
            </View>
            <Text
              style={[
                walletStyle.lowerTitle,
                {marginTop: 20, color: isDark ? '#fff' : '#000'},
              ]}>
              {i18n.t('Wallet.Weekly-Spend')}
            </Text>
            <View
              style={[
                walletStyle.lowerContent2,
                {backgroundColor: isDark ? '#313131' : '#fff'},
              ]}>
              <LineChart
                areaChart
                hideDataPoints
                hideRules
                isAnimated
                animationDuration={1200}
                startFillColor="#FF2D00"
                startOpacity={1}
                endOpacity={0.1}
                data={spendData}
                color="#FF2D00"
                yAxisTextStyle={{color: isDark ? '#fff' : '#000'}}
                xAxisLabelTextStyle={{color: isDark ? '#fff' : '#000'}}
                curved
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Ewallet;
