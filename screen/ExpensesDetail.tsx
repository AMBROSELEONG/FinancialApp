import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import i18n from '../language/language';
import MainContainer from '../components/MainContainer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, debtDetailCss, walletStyle} from '../objects/commonCss';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useScrollToTop} from '@react-navigation/native';
import {PieChart} from 'react-native-gifted-charts';

const ExpenseDetails = () => {
  const navigation = useNavigation();

  const [debtID, setDebtID] = useState('');
  const [debtName, setDebtName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [year, setYear] = useState('');
  const [yearsLeft, setYearLeft] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [lastDate, setLastDate] = useState('');
  const [nextDate, setNextDate] = useState('');
  const [cumulative, setCumulative] = useState(0);
  const [debtPayID, setDebtPayID] = useState('');
  const [endDate, setEndDate] = useState('');
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

  const typeMap: Record<string, string> = {
    '1': i18n.t('DebtList.Type1'),
    '2': i18n.t('DebtList.Type2'),
    '3': i18n.t('DebtList.Type3'),
    '4': i18n.t('DebtList.Type4'),
    '5': i18n.t('DebtList.Type5'),
    '6': i18n.t('DebtList.Type6'),
    '7': i18n.t('DebtList.Type7'),
    '8': i18n.t('DebtList.Type8'),
    '9': i18n.t('DebtList.Type9'),
    '10': i18n.t('DebtList.Type10'),
    '11': i18n.t('DebtList.Type11'),
    '12': i18n.t('DebtList.Type12'),
    '13': i18n.t('DebtList.Type13'),
  };

  const fetchData = async (debtId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Debt/GetDebtsByDebtID?debtId=${debtId}`,
        {'Content-Type': 'application/json'},
      );
      const result = await response.json();

      if (result.success === true) {
        setDate(result.data.date);
        setAmount(result.data.amount);
        setDebtName(result.data.debtName);
        setYear(result.data.year);
        setYearLeft(result.monthsLeft);
        setTotalAmount(result.data.totalAmount);
        setEndDate(result.endDate);
      } else if (result.success === "Done") {
        Alert.alert(i18n.t('DebtDetail.Congratulation'), i18n.t('DebtDetail.Pay-Off'), [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      }
    } catch (error) {
      ErrorToast(error);
    }
  };

  const fetchDebtPay = async (debtId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Debt/GetDebtPayByDebtID?debtId=${debtId}`,
        {'Content-Type': 'application/json'},
      );
      const result = await response.json();

      if (result.success) {
        setDebtPayID(result.data.debtPayID);
        setLastDate(result.data.lastDate.toString().split('T')[0]);
        setNextDate(result.data.nextDate.toString().split('T')[0]);
        setCumulative(result.totalPaid);
      }
    } catch (error) {
      ErrorToast(error);
    }
  };

  const Date = date.toString().split('T')[0];
  const formatDate = Date.toString().split('-')[2];
  let suffix;
  if (parseInt(formatDate) > 3 && parseInt(formatDate) < 21) {
    suffix = 'th';
  } else {
    switch (parseInt(formatDate) % 10) {
      case 1:
        suffix = 'st';
        break;
      case 2:
        suffix = 'nd';
        break;
      case 3:
        suffix = 'rd';
        break;
      default:
        suffix = 'th';
        break;
    }
  }
  const initialize = async () => {
    setLoading(true);
    try {
      const [savedTheme, storedUserID, storedDebtID] = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('UserID'),
        AsyncStorage.getItem('DebtID'),
      ]);

      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }

      if (storedUserID) {
      }

      if (storedDebtID) {
        setDebtID(storedDebtID);
        await fetchData(storedDebtID);
        await fetchDebtPay(storedDebtID);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const YearsLeft = parseInt(yearsLeft);
  const remain = parseInt(year) * 12 - YearsLeft;
  const percent = (remain / (parseInt(year) * 12)) * 100;
  const pieData = [
    {value: remain, color: '#3490DE'},
    {value: YearsLeft, color: '#fff'},
  ];

  const debtPay = () => {
    Alert.alert(
      i18n.t('DebtDetail.Pay-Now'),
      i18n.t('DebtDetail.Next-Payment') + nextDate + '\n' + i18n.t('DebtDetail.Want-Pay-Now'),
      [
        {text: i18n.t('DebtDetail.No'), style: 'cancel'},
        {text: i18n.t('DebtDetail.Pay'), onPress: () => paynow()},
      ],
    );
  };

  const paynow = async () => {
    setLoading(true);
    try {
      await RNFetchBlob.config({trusty: true})
        .fetch(
          'POST',
          `${UrlAccess.Url}DebtHistory/AddDebtHistory`,
          {'Content-Type': 'application/json'},
          JSON.stringify({
            debtPayID: debtPayID,
          }),
        )
        .then(response => response.json())
        .then(json => {
          if (json && json.success) {
            SuccessToast(i18n.t('DebtDetail.Pay-Debt-Success'));
            initialize();
          } else {
            ErrorToast(i18n.t('DebtDetail.Pay-Debt-Failed'));
          }
        });
    } catch (error) {
      ErrorToast('Error');
    } finally {
      setLoading(false);
    }
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

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar
          animated={true}
          backgroundColor={isDark ? '#000' : '#f4f4f4'}
          barStyle={'dark-content'}
        />
        <View
          style={[
            css.mainView,
            {backgroundColor: isDark ? '#000' : '#f4f4f4'},
          ]}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.goBack(), AsyncStorage.removeItem('BankID');
            }}>
            <Ionicons
              name="arrow-back"
              size={30}
              color={isDark ? '#fff' : '#000'}
            />
          </TouchableOpacity>
          <View style={[css.HeaderView, {marginRight: 0}]}>
            <Text style={[css.PageName, {color: isDark ? '#fff' : '#000'}]}>
              {typeMap[debtName]}
            </Text>
          </View>
        </View>
        <View
          style={[
            walletStyle.upperContainer,
            {backgroundColor: isDark ? '#202020' : '#f4f4f4', paddingBottom: 0},
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
              <Text style={walletStyle.balanceText}>RM {amount}</Text>
              <Text style={walletStyle.title}>
                {year} {i18n.t('DebtDetail.Years')} - {endDate.toString().split('T')[0]}
              </Text>
              <Text style={walletStyle.asset}>
                {formatDate}
                {suffix} {i18n.t('DebtDetail.Per-Month')}
              </Text>
            </LinearGradient>
          </View>
          <View style={walletStyle.rightContent}>
            <TouchableOpacity
              style={walletStyle.buttonView}
              onPress={() => debtPay()}>
              <View
                style={[
                  walletStyle.circle,
                  {backgroundColor: isDark ? '#313131' : '#fff'},
                ]}>
                <Image
                  source={require('../assets/credit-card.png')}
                  style={walletStyle.icon}
                />
              </View>
              <Text style={walletStyle.buttonText}>{i18n.t('DebtDetail.Pay-Now')}</Text>
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
                <Text style={walletStyle.lowerText}>{i18n.t('DebtDetail.Debt-Pay-Off-Year')}</Text>
                <Text
                  style={[
                    walletStyle.lowerSubtext,
                    {color: isDark ? '#fff' : '#000'},
                  ]}>
                  {year} {i18n.t('DebtDetail.Years')}
                </Text>
                <Text style={walletStyle.lowerSubtext2}>
                 {i18n.t('DebtDetail.Distance-To-Pay')}
                </Text>
                <Text style={walletStyle.lowerSubtext2}>
                  {YearsLeft} {i18n.t('DebtDetail.Month-Left')}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <PieChart
                  donut
                  innerRadius={35}
                  data={pieData}
                  innerCircleColor={isDark ? '#313131' : '#fff'}
                  centerLabelComponent={() => {
                    return (
                      <Text
                        style={{
                          fontSize: 20,
                          color: isDark ? '#fff' : '#000',
                          fontWeight: 'bold',
                        }}>
                        {percent.toFixed(0)}%
                      </Text>
                    );
                  }}
                  radius={45}
                />
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
              <View style={[debtDetailCss.lowerContent, {marginRight: 5}]}>
                <Text style={walletStyle.lowerText}>{i18n.t('DebtDetail.Cumulative-Repayment')}</Text>
                <Text style={debtDetailCss.cumulative}>RM {cumulative}</Text>
              </View>
              <View style={[debtDetailCss.lowerContent, {marginLeft: 5}]}>
                <Text style={walletStyle.lowerText}>{i18n.t('DebtDetail.Estimated-Total')}</Text>
                <Text style={debtDetailCss.cumulative}>RM {totalAmount}</Text>
              </View>
            </View>
            <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
              <View style={[debtDetailCss.lowerContent, {marginRight: 5}]}>
                <Text style={walletStyle.lowerText}>{i18n.t('DebtDetail.Start')}</Text>
                <Text style={[debtDetailCss.cumulative, {color: '#000'}]}>
                  {lastDate}
                </Text>
              </View>
              <View style={[debtDetailCss.lowerContent, {marginLeft: 5}]}>
                <Text style={walletStyle.lowerText}>{i18n.t('DebtDetail.Next-Payment-Date')}</Text>
                <Text style={[debtDetailCss.cumulative, {color: '#000'}]}>
                  {nextDate}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default ExpenseDetails;
