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
import {css, walletStyle} from '../objects/commonCss';
import BankIncome from './BankIncome';
import BankSpend from './BankSpend';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import LinearGradient from 'react-native-linear-gradient';
import BankHistory from './BankHistory';
import {PieChart, LineChart} from 'react-native-gifted-charts';

interface ChartData {
  value: number;
  label: string;
}

interface IncomeData {
  date: string;
  totalSpend: number;
}

const BankDetail = () => {
  const navigation = useNavigation();

  const [isDark, setIsDark] = useState(false);
  const [locale, setLocale] = React.useState(i18n.locale);
  const [UserID, setUserId] = useState('');
  const [bankName, setBankName] = useState('');
  const [Balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bankID, setBankID] = useState('');
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
      }
    } catch (error) {
      ErrorToast('No Data');
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
      }
    } catch (error) {
      ErrorToast('No Data');
    }
  };

  const fetchIncomeCategory = async (bankId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}BankIncome/GetUserWeeklyIncomeTypeRatio?bankId=${bankId}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();
      if (json.success) {
        setMaxIncomeType(json.maxType);
        setMaxIncomeAmount(json.maxTypeAmount);
        setMaxIncomeRatio(json.ratio);
      }
    } catch (error) {
      ErrorToast('No Data');
    }
  };

  const fetchSpendCategory = async (bankId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}BankSpend/GetUserWeeklySpendTypeRatio?bankId=${bankId}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();
      if (json.success) {
        setMaxSpendType(json.maxType);
        setMaxSpendAmount(json.maxTypeAmount);
        setMaxSpendRatio(json.ratio);
      }
    } catch (error) {
      ErrorToast('No Data');
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  };

  const Income = async (bankId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}BankIncome/WeeklyIncome?bankId=${bankId}`,
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
      ErrorToast('No Data');
    }
  };

  const Spend = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}BankSpend/WeeklySpend?bankId=${UserID}`,
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
      ErrorToast('No Data');
    }
  };

  const [percent, setPercent] = useState('');

  const fetchTotalBalance = async (userId: string, bankId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Bank/GetPercent?userID=${userId}&bankID=${bankId}`,
        {'Content-Type': 'application/json'},
      );

      const result = await response.json();

      if (result.success) {
        setPercent(result.total.specifiedBankPercentage.toFixed(0));
      }
    } catch (error) {
      ErrorToast('No Data');
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
        await fetchIncomeCategory(storedBankID);
        await fetchSpendCategory(storedBankID);
        await Income(storedBankID);
        await Spend(storedBankID);
      }

      if (storedUserID && storedBankID) {
        setUserId(storedUserID);
        await fetchTotalBalance(storedUserID, storedBankID);
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
              {bankName.substring(0, 20)}
            </Text>
          </View>
          <TouchableOpacity
            style={{paddingLeft: 20, marginRight: 20}}
            onPress={() => handleDelete()}>
            <MaterialCommunityIcons name="delete" size={30} color={'#ff0000'} />
          </TouchableOpacity>
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
              onPress={() => navigation.navigate(BankIncome as never)}>
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
              <Text style={walletStyle.buttonText}>
                {i18n.t('Wallet.Income')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={walletStyle.buttonView}
              onPress={() => navigation.navigate(BankSpend as never)}>
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
              <Text style={walletStyle.buttonText}>
                {i18n.t('Wallet.Spend')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={walletStyle.buttonView}
              onPress={() => navigation.navigate(BankHistory as never)}>
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
              <Text style={walletStyle.buttonText}>
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

export default BankDetail;
