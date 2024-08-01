import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Alert,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import MainContainer from '../components/MainContainer';
import {assistantCss, css} from '../objects/commonCss';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import * as GoogleGenerativeAI from '@google/generative-ai';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import financeKeywordsData from './financeKeywords.json';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import i18n from '../language/language';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  text: string;
  user: boolean;
}

const Assistant = () => {
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = 'AIzaSyDWLvBCqIUdk0hvwLEc63CLlGaWkjR3BmE';

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

  const [locale, setLocale] = React.useState(i18n.locale);
  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
      initialize();
    }, []),
  );

  useEffect(() => {
    const startChat = async () => {
      setLoading(true);
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({model: 'gemini-pro'});
      const prompt = i18n.t('Assistant.Hello');
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setMessages([
        {
          text,
          user: false,
        },
      ]);
      setLoading(false);
    };
    startChat();
  }, []);

  const sendMessage = async () => {
    const financeKeywords = financeKeywordsData.keywords;
    const containsFinanceKeywords = financeKeywords.some(keyword =>
      userInput.toLowerCase().includes(keyword),
    );

    if (!containsFinanceKeywords) {
      ErrorToast(i18n.t('AssistantPage.Question'));
      return;
    }

    setLoading(true);
    const userMessage = {text: userInput, user: true};
    setMessages([...messages, userMessage]);

    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({model: 'gemini-pro'});
    const prompt = userMessage.text;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    setMessages([...messages, {text, user: false}]);
    setUserInput('');
    setLoading(false);
  };

  const Analyze = async () => {
    setLoading(true);
    const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({model: 'gemini-pro'});
    const prompt = `${i18n.t('Assistant.Total-Wallet')}: RM${walletBalance} \n
     ${i18n.t('Assistant.Total-Ewallet')}: RM${ewalletBalance} \n
     ${i18n.t('Assistant.Total-Bank')}: RM${bankBalance} \n
     ${i18n.t('Assistant.Total-Debt')}: RM${totalDebt} \n
     ${i18n.t('Assistant.Total-Wallet-Income')}: RM${totalWalletWeeklyIncome} \n
     ${i18n.t('Assistant.Total-Wallet-Spend')}: RM${totalWalletWeeklyExpense} \n
     ${i18n.t(
       'Assistant.Total-Ewallet-Income',
     )}: RM${totalEwalletWeeklyIncome} \n
     ${i18n.t(
       'Assistant.Total-Ewallet-Spend',
     )}: RM${totalEwalletWeeklyExpense} \n
     ${i18n.t('Assistant.Total-Bank-Income')}: RM${totalBankWeeklyIncome} \n
     ${i18n.t('Assistant.Total-Bank-Spend')}: RM${totalBankWeeklyExpense} \n
     ${i18n.t('Assistant.Analyze')}: `;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    setMessages([
      {
        text,
        user: false,
      },
    ]);
    setLoading(false);
  };

  const [walletBalance, setWalletBalance] = useState(0);
  const [ewalletBalance, setEwalletBalance] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const [totalDebt, setDebtTotal] = useState(0);
  const [totalWalletWeeklyIncome, setTotalWalletWeeklyIncome] = useState(0);
  const [totalWalletWeeklyExpense, setTotalWalletWeeklyExpense] = useState(0);
  const [totalEwalletWeeklyIncome, setTotalEwalletWeeklyIncome] = useState(0);
  const [totalEwalletWeeklyExpense, setTotalEwalletWeeklyExpense] = useState(0);
  const [totalBankWeeklyIncome, setTotalBankWeeklyIncome] = useState(0);
  const [totalBankWeeklyExpense, setTotalBankWeeklyExpense] = useState(0);

  const fetchData = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Assistant/GetAnalyzeData?userID=${UserID}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();
      if (json.success) {
        setWalletBalance(json.walletData.balance);
        setEwalletBalance(json.ewalletData.balance);
        setBankBalance(json.bankData.totalBalance);
        setDebtTotal(json.debtData.totalDebt);
        setTotalWalletWeeklyIncome(json.totalWalletWeeklyIncome);
        setTotalWalletWeeklyExpense(json.totalWalletWeeklySpend);
        setTotalEwalletWeeklyIncome(json.totalEwalletWeeklyIncome);
        setTotalEwalletWeeklyExpense(json.totalEwalletWeeklySpend);
        setTotalBankWeeklyIncome(json.totalBankWeeklyIncome);
        setTotalBankWeeklyExpense(json.totalBankWeeklySpend);
      }
    } catch (error) {}
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
        await fetchData(storedUserID);
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

  const renderMessage = ({item}: {item: Message}) => (
    <View style={assistantCss.messageContainer}>
      <Text
        style={[
          assistantCss.messageText,
          item.user && assistantCss.messageText,
        ]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <MainContainer>
      <StatusBar
        animated={true}
        backgroundColor={isDark ? '#000' : '#F4F4F4'}
        barStyle={'dark-content'}
      />
      <View
        style={[css.mainView, {backgroundColor: isDark ? '#000' : '#B8D8EA'}]}>
        <TouchableOpacity
          style={{paddingLeft: 20}}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}>
          <Ionicons name="menu" size={30} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <View style={css.HeaderView}>
          <Text style={[css.PageName, {color: isDark ? '#fff' : '#000'}]}>
            {i18n.t('AssistantPage.Financial-Assistant')}
          </Text>
        </View>
      </View>
      <View
        style={[
          assistantCss.container,
          {backgroundColor: isDark ? '#3A3A3A' : '#B8D8EA'},
        ]}>
        <View style={{flex: 1}}>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.text}
          />
        </View>
        {loading && <ActivityIndicator size="large" color="black" />}
        <TouchableOpacity style={[assistantCss.selectButton,{backgroundColor: isDark? '#000' : '#fff'}]} onPress={Analyze}>
          <Text style={[assistantCss.selectButtonText,{color: isDark? '#fff' : '#000'}]}>
            {i18n.t('AssistantPage.Analyze-My-Finances')}
          </Text>
        </TouchableOpacity>
        <View style={assistantCss.bottomContainer}>
          <TextInput
            placeholder={i18n.t('AssistantPage.Placeholder')}
            onChangeText={setUserInput}
            value={userInput}
            style={[assistantCss.inputContainer,{backgroundColor: isDark ? '#000' : '#fff'}]}
            placeholderTextColor="#999999"
          />
          <TouchableOpacity onPress={sendMessage} style={assistantCss.button}>
            <FontAwesome
              name="send"
              size={24}
              color="#fff"
              style={{textAlign: 'center'}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </MainContainer>
  );
};

export default Assistant;
