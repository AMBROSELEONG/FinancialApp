import React, {useState, useEffect, useCallback} from 'react';
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
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, homeCss} from '../objects/commonCss';
import {ScrollView} from 'react-native-gesture-handler';
import {LineChart} from 'react-native-gifted-charts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import {darkCss} from '../objects/darkCss';
import LinearGradient from 'react-native-linear-gradient';

interface SpendData {
  date: string;
  totalSpend: number;
}

interface ChartData {
  value: number;
  label: string;
}

interface IncomeData {
  date: string;
  totalSpend: number;
}

interface DataItem {
  value: number;
  color: string;
}

interface StackedProgressBarProps {
  data: DataItem[];
}

const StackedProgressBar: React.FC<StackedProgressBarProps> = ({data}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <View style={homeCss.progressContainer}>
      {data.map((item, index) => (
        <View
          key={index}
          style={[
            homeCss.progressItem,
            {
              width: `${(item.value / total) * 100}%`,
              backgroundColor: item.color,
            },
          ]}
        />
      ))}
    </View>
  );
};

const Home = () => {
  const navigation = useNavigation();
  const [UserName, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = React.useState(i18n.locale);
  const [token, setToken] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [spend, setSpend] = useState(0);
  const [income, setIncome] = useState(0);
  const [spendData, setSpendData] = useState<ChartData[]>([]);
  const [incomeData, setIncomeData] = useState<ChartData[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const [ewalletBalance, setEwalletBalance] = useState(0);
  const [percentWallet, setPercentWallet] = useState(0);
  const [percentBank, setPercentBank] = useState(0);
  const [percentEwallet, setPercentEwallet] = useState(0);

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

  const initialize = async () => {
    setLoading(true);

    try {
      const [storedUserID, storedToken, savedTheme] = await Promise.all([
        AsyncStorage.getItem('UserID'),
        AsyncStorage.getItem('Token'),
        AsyncStorage.getItem('theme'),
      ]);

      if (storedUserID) {
        setUserId(storedUserID);
        await fetchData(storedUserID);
        await updateToken(storedUserID, storedToken);
        await CreateWallet(storedUserID);
        await CreateEwallet(storedUserID);
        await fetchSpend(storedUserID);
        await fetchSpendData(storedUserID);
        await fetchIncome(storedUserID);
        await fetchIncomeData(storedUserID);
        await fetchTotalBalance(storedUserID);
      }

      if (storedToken) {
        setToken(storedToken);
      }

      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}-${day}`;
  };

  const fetchData = async (userId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}User/GetUserData?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );

      const json = await response.json();

      if (json.success) {
        setUsername(json.userData.userName);
        setLoading(false);
      } else {
        ErrorToast(i18n.t('Home.Failed-Fetch'));
      }
    } catch (error) {
      ErrorToast(i18n.t('Home.Error-Fetch'));
    }
  };

  const fetchSpend = async (userId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}DataAnalysis/TotalSpend?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );

      const json = await response.json();

      if (json.success) {
        setSpend(json.data);
        setLoading(false);
      } else {
        ErrorToast(i18n.t('Home.Failed-Fetch'));
      }
    } catch (error) {
      ErrorToast(i18n.t('Home.Error-Fetch'));
    }
  };

  const fetchSpendData = async (userId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}DataAnalysis/WeeklySpend?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );
      const result = await response.json();

      if (result.success) {
        const resultData: ChartData[] = result.data.map((item: SpendData) => {
          return {
            value: item.totalSpend,
            label: formatDate(item.date),
          };
        });
        setSpendData(resultData);
      }
    } catch (error) {
      ErrorToast(i18n.t('Home.Error-Fetch'));
    }
  };

  const fetchIncome = async (userId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}DataAnalysis/TotalIncome?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );

      const json = await response.json();

      if (json.success) {
        setIncome(json.data);
        setLoading(false);
      } else {
        ErrorToast(i18n.t('Home.Failed-Fetch'));
      }
    } catch (error) {
      ErrorToast(i18n.t('Home.Error-Fetch'));
    }
  };

  const fetchIncomeData = async (userId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}DataAnalysis/WeeklyIncome?userId=${userId}`,
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
      ErrorToast(i18n.t('Home.Error-Fetch'));
    }
  };

  const updateToken = async (userId: any, token: any) => {
    try {
      RNFetchBlob.config({trusty: true}).fetch(
        'POST',
        `${UrlAccess.Url}User/UpdateToken`,
        {'Content-Type': 'application/json'},
        JSON.stringify({
          userId: userId,
          token: token,
        }),
      );
    } catch (error) {
      ErrorToast(i18n.t('Fail-Load-Token'));
    }
  };

  const CreateWallet = async (userId: any) => {
    try {
      RNFetchBlob.config({trusty: true}).fetch(
        'POST',
        `${UrlAccess.Url}Wallet/CreateWallet`,
        {'Content-Type': 'application/json'},
        JSON.stringify({
          userID: userId,
        }),
      );
    } catch (error) {
      ErrorToast(i18n.t('Home.Fail-Create-Data'));
    }
  };

  const CreateEwallet = async (userId: any) => {
    try {
      RNFetchBlob.config({trusty: true}).fetch(
        'POST',
        `${UrlAccess.Url}Ewallet/CreateEwallet`,
        {'Content-Type': 'application/json'},
        JSON.stringify({
          userID: userId,
        }),
      );
    } catch (error) {
      ErrorToast(i18n.t('Home.Fail-Create-Data'));
    }
  };

  const fetchTotalBalance = async (userId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}DataAnalysis/GetPercentage?userID=${userId}`,
        {'Content-Type': 'application/json'},
      );

      const result = await response.json();

      if (result.success) {
        setBankBalance(result.total.bankBalance.toFixed(2));
        setEwalletBalance(result.total.ewalletBalance.toFixed(2));
        setWalletBalance(result.total.walletBalance.toFixed(2));
        setPercentWallet(result.total.walletPercentage);
        setPercentBank(result.total.bankPercentage);
        setPercentEwallet(result.total.ewalletPercentage);
      }
    } catch (error) {
      ErrorToast(error);
    }
  };

  const data: DataItem[] = [
    {value: percentWallet, color: '#8BA758'},
    {value: percentBank, color: '#B8D8EA'},
    {value: percentEwallet, color: '#F6B7C6'},
  ];

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
          backgroundColor={isDark ? '#000' : '#1C4E78'}
          barStyle={'dark-content'}
        />
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1}}
          colors={isDark ? ['#000', '#000'] : ['#1C4E78', '#3490DE']}
          style={homeCss.linear}>
          <View style={[css.mainView, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={{paddingLeft: 20}}
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <Ionicons name="menu" size={30} color={'#fff'} />
            </TouchableOpacity>
            <View style={css.HeaderView}>
              <Text style={[darkCss.PageName, {}]}>{i18n.t('Home.Home')}</Text>
            </View>
          </View>
          <View style={{position: 'relative'}}>
            <Text style={homeCss.welcomeText}>
              {i18n.t('Home.Welcome-Back')}
            </Text>
            <Text style={homeCss.userText}>{UserName}</Text>
          </View>
          {isDark ? null : (
            <Image
              source={require('../assets/growth.png')}
              style={homeCss.Image}
            />
          )}
        </LinearGradient>
        <View
          style={[
            homeCss.lowerContainer,
            {backgroundColor: isDark ? '#202020' : '#F5F5F5'},
          ]}>
          <ScrollView>
            <Text style={[homeCss.title, {color: isDark ? '#fff' : '#000'}]}>
              {i18n.t('Home.Financial-Overview')}
            </Text>
            <View style={homeCss.overviewContainer}>
              <View
                style={[
                  homeCss.overviewBox,
                  {marginRight: 10, backgroundColor: '#538DB3'},
                ]}>
                <Text style={[homeCss.overviewText, {color: '#fff'}]}>
                  {i18n.t('Home.Income-Today')}
                </Text>
                <Text style={[homeCss.overviewBalance, {color: '#fff'}]}>
                  RM {income.toFixed(2)}
                </Text>
                <Image
                  source={require('../assets/inflation.png')}
                  style={homeCss.imageIcon}
                />
              </View>
              <View
                style={[
                  homeCss.overviewBox,
                  {marginLeft: 10, backgroundColor: '#B8D8EA'},
                ]}>
                <Text style={[homeCss.overviewText, {color: '#000'}]}>
                  {i18n.t('Home.Spend-Today')}
                </Text>
                <Text style={[homeCss.overviewBalance, {color: '#000'}]}>
                  RM {spend.toFixed(2)}
                </Text>
                <Image
                  source={require('../assets/expense.png')}
                  style={homeCss.imageIcon}
                />
              </View>
            </View>
            <Text style={[homeCss.title, {color: isDark ? '#fff' : '#000'}]}>
              {i18n.t('Home.Balance-Overview')}
            </Text>
            <View
              style={[
                homeCss.balanceContainer,
                {backgroundColor: isDark ? '#2D2D2D' : '#fff'},
              ]}>
              <View>
                <View
                  style={[
                    homeCss.circle,
                    {backgroundColor: isDark ? '#404040' : '#F0F0F0'},
                  ]}>
                  <Image
                    source={require('../assets/walletHome.png')}
                    style={homeCss.imageHome}
                  />
                </View>
                <Text style={homeCss.balanceText}>
                  {i18n.t('Wallet.Wallet')}
                </Text>
                <Text
                  style={[homeCss.balance, {color: isDark ? '#fff' : '#000'}]}>
                  {walletBalance}
                </Text>
              </View>
              <View>
                <View
                  style={[
                    homeCss.circle,
                    {backgroundColor: isDark ? '#404040' : '#F0F0F0'},
                  ]}>
                  <Image
                    source={require('../assets/bankHome.png')}
                    style={homeCss.imageHome}
                  />
                </View>
                <Text style={homeCss.balanceText}>{i18n.t('Bank.Bank')}</Text>
                <Text
                  style={[homeCss.balance, {color: isDark ? '#fff' : '#000'}]}>
                  {bankBalance}
                </Text>
              </View>
              <View>
                <View
                  style={[
                    homeCss.circle,
                    {backgroundColor: isDark ? '#404040' : '#F0F0F0'},
                  ]}>
                  <Image
                    source={require('../assets/ewalletHome.png')}
                    style={homeCss.imageHome}
                  />
                </View>
                <Text style={homeCss.balanceText}>
                  {i18n.t('Ewallet.Ewallet')}
                </Text>
                <Text
                  style={[homeCss.balance, {color: isDark ? '#fff' : '#000'}]}>
                  {ewalletBalance}
                </Text>
              </View>
            </View>
            <StackedProgressBar data={data} />
            <Text style={[homeCss.title, {color: isDark ? '#fff' : '#000'}]}>
              {i18n.t('Home.Weekly-Income')}
            </Text>
            <View
              style={[
                homeCss.barContainer,
                {backgroundColor: isDark ? '#2D2D2D' : '#fff'},
              ]}>
              <LineChart
                areaChart
                hideDataPoints
                hideRules
                isAnimated
                animationDuration={1200}
                startFillColor="#B8D8EA"
                startOpacity={1}
                endOpacity={0.3}
                data={incomeData}
                thickness={5}
                yAxisColor="#B8D8EA"
                xAxisColor="#B8D8EA"
                color="#B8D8EA"
                yAxisTextStyle={{color: isDark ? '#fff' : '#000'}}
                xAxisLabelTextStyle={{color: isDark ? '#fff' : '#000'}}
                curved
              />
            </View>
            <Text style={[homeCss.title, {color: isDark ? '#fff' : '#000'}]}>
              {i18n.t('Home.Weekly-Spend')}
            </Text>
            <View
              style={[
                homeCss.barContainer,
                {backgroundColor: isDark ? '#2D2D2D' : '#fff'},
              ]}>
              <LineChart
                areaChart
                hideDataPoints
                hideRules
                isAnimated
                animationDuration={1200}
                startFillColor="#B8D8EA"
                startOpacity={1}
                endOpacity={0.3}
                data={spendData}
                thickness={5}
                yAxisColor="#B8D8EA"
                xAxisColor="#B8D8EA"
                color="#B8D8EA"
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

export default Home;
