import React, {useState, useEffect, useCallback} from 'react';
import MainContainer from '../components/MainContainer';
import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator,
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
import {darkCss, darkHome} from '../objects/darkCss';

const Home = () => {
  const navigation = useNavigation();
  const [currentDate, setCurrentDate] = useState('');
  const [UserName, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [locale, setLocale] = React.useState(i18n.locale);
  const [token, setToken] = useState('');
  const [isDark, setIsDark] = useState(false);

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
    initialize();
  }, [userId, token]);

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

  useEffect(() => {
    const updateDate = () => {
      const date = new Date();
      const day = date.getDate();
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      setCurrentDate(`${day} ${month} ${year}`);
    };

    updateDate();
    const interval = setInterval(updateDate, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const data = [
    {value: 50, label: '9/6'},
    {value: 30, label: '8/6'},
    {value: 70, label: '7/6'},
    {value: 40, label: '6/6'},
    {value: 90, label: '5/6'},
    {value: 20, label: '4/6'},
    {value: 60, label: '3/6'},
  ];
  const screenWidth = (Dimensions.get('window').width / 100) * 70;
  const screenHeight = (Dimensions.get('window').width / 100) * 50;

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
        <ScrollView>
          <View style={isDark ? darkCss.mainView : css.mainView}>
            <TouchableOpacity
              style={{paddingLeft: 20}}
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <Ionicons
                name="menu"
                size={30}
                color={isDark ? '#fff' : '#000'}
              />
            </TouchableOpacity>
            <View style={css.HeaderView}>
              <Text style={isDark ? darkCss.PageName : css.PageName}>
                {i18n.t('Home.Home')}
              </Text>
            </View>
          </View>
          <View style={isDark ? darkHome.container : homeCss.container}>
            <Text style={isDark ? darkHome.welcome : homeCss.welcome}>
              {i18n.t('Home.Welcome-Back')}
            </Text>
            <Text style={homeCss.user}>{UserName}</Text>
            <View
              style={isDark ? darkHome.dateContainer : homeCss.dateContainer}>
              <Text style={isDark ? darkHome.date : homeCss.date}>
                {currentDate}
              </Text>
            </View>
            <View
              style={isDark ? darkHome.spendContainer : homeCss.spendContainer}>
              <Text style={isDark ? darkHome.spend : homeCss.spend}>
                {i18n.t('Home.Spending')}
              </Text>
              <View style={homeCss.chartContainer}>
                <LineChart
                  data={data}
                  width={screenWidth}
                  height={screenHeight}
                  color="#1E90FF"
                  thickness={1}
                  hideDataPoints={false}
                  dataPointsColor="#FF6347"
                  showVerticalLines={true}
                  verticalLinesColor="#E0E0E0"
                  showValuesAsDataPointsText
                  xAxisLabelTextStyle={
                    isDark ? darkHome.xAxisLabel : homeCss.xAxisLabel
                  }
                />
              </View>
              <Text style={isDark ? darkHome.totalText : homeCss.totalText}>
                {i18n.t('Home.Total-Spending')}
              </Text>
              <Text style={homeCss.total}>RM 150.00</Text>
            </View>
            <View
              style={[
                isDark ? darkHome.spendContainer : homeCss.spendContainer,
                {marginBottom: 30},
              ]}>
              <Text style={isDark ? darkHome.spend : homeCss.spend}>
                {i18n.t('Home.Increase')}
              </Text>
              <View style={homeCss.chartContainer}>
                <LineChart
                  data={data}
                  width={screenWidth}
                  height={screenHeight}
                  color="#1E90FF"
                  thickness={1}
                  hideDataPoints={false}
                  dataPointsColor="#FF6347"
                  showVerticalLines={true}
                  verticalLinesColor="#E0E0E0"
                  showValuesAsDataPointsText
                  xAxisLabelTextStyle={
                    isDark ? darkHome.xAxisLabel : homeCss.xAxisLabel
                  }
                />
              </View>
              <Text style={isDark ? darkHome.totalText : homeCss.totalText}>
                {i18n.t('Home.Total-Increase')}
              </Text>
              <Text style={homeCss.total}>RM 150.00</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Home;
