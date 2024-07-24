import MainContainer from '../components/MainContainer';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, walletIncomeCss} from '../objects/commonCss';
import {TextInput, HelperText, List} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {SelectList} from 'react-native-dropdown-select-list';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {darkCss, darkWalletIncome} from '../objects/darkCss';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';

const BankIncome = () => {
  const navigation = useNavigation();

  const theme = {
    roundness: 20, // Set the border radius here
    colors: {
      primary: '#000', // Active outline color
      outline: '#808080', // Outline color
    },
  };

  const darkTheme = {
    roundness: 20, // Set the border radius here
    colors: {
      primary: '#3490DE', // Active outline color
      outline: '#808080', // Outline color
    },
  };

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

  const [Total, setTotal] = useState('');
  const [TotalError, setTotalError] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [SelectTypeError, setSelectTypeError] = useState('');

  const selectType = [
    {key: '1', value: i18n.t('IncomeType.Type1')},
    {key: '2', value: i18n.t('IncomeType.Type2')},
    {key: '3', value: i18n.t('IncomeType.Type3')},
    {key: '4', value: i18n.t('IncomeType.Type4')},
    {key: '5', value: i18n.t('IncomeType.Type5')},
    {key: '6', value: i18n.t('IncomeType.Type6')},
    {key: '7', value: i18n.t('IncomeType.Type7')},
    {key: '9', value: i18n.t('IncomeType.Type9')},
  ];

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const formatDate = (date: any) => {
    return date.toISOString().substring(0, 10);
  };

  const [formattedDate, setFormattedDate] = useState(formatDate(new Date()));

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    setFormattedDate(formatDate(currentDate));
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userID, setUserId] = useState('');
  const [Balance, setBalance] = useState('');
  const [bankID, setBankID] = useState('');

  const fetchData = async (bankId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Bank/GetBanksByBankID?bankId=${bankId}`,
        {'Content-Type': 'application/json'},
      );

      const json = await response.json();

      if (json.success) {
        setBalance(json.data.amount.toFixed(2));
      } else {
        ErrorToast(i18n.t('SettingPage.Failed-Fetch-Data'));
      }
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
      }

      if (storedUserID) {
        setUserId(storedUserID);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const [locale, setLocale] = React.useState(i18n.locale);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
      setTotal('');
      setSelectedType('');
    }, []),
  );

  const validateNormal = async () => {
    let isValid = true;
    const amount = parseFloat(Total);
    const balance = parseFloat(Balance);

    if (!amount) {
      setTotalError(i18n.t('Bank.Total-Empty'));
      isValid = false;
    } else if (isNaN(amount) || amount <= 0) {
      setTotalError(i18n.t('Bank.Total-Invalid'));
      isValid = false;
    } else if (amount >= balance) {
      setTotalError(i18n.t('WalletSpend.Total-Exceeds-Balance'));
      isValid = false;
    } else {
      setTotalError('');
    }

    if (!selectedType) {
      setSelectTypeError(i18n.t('WalletIncome.Type-Empty'));
      isValid = false;
    } else {
      setSelectTypeError('');
    }

    if (isValid) {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      if (bankID && userID && amount && selectedType && formattedDate) {
        try {
          await RNFetchBlob.config({trusty: true})
            .fetch(
              'POST',
              `${UrlAccess.Url}BankIncome/AddIncome`,
              {'Content-Type': 'application/json'},
              JSON.stringify({
                bankID: bankID,
                userID: userID,
                amount: amount,
                type: selectedType,
                date: formattedDate,
              }),
            )
            .then(response => response.json())
            .then(json => {
              if (json && json.success) {
                SuccessToast(i18n.t('WalletIncome.Success'));
                initialize();
              } else {
                ErrorToast(i18n.t('WalletIncome.Fail'));
              }
            });
        } catch (error) {
          ErrorToast(error);
        } finally {
          setLoading(false);
        }
      }
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
              {i18n.t('WalletIncome.Income')}
            </Text>
          </View>
        </View>
        <View
          style={
            isDark ? darkWalletIncome.container : walletIncomeCss.container
          }>
          <Text style={isDark ? darkWalletIncome.title : walletIncomeCss.title}>
            {i18n.t('BankIncome.Fill')}
          </Text>
          <Text style={walletIncomeCss.subtitle}>
            {i18n.t('WalletIncome.Balance')}
          </Text>
          <Text
            style={isDark ? darkWalletIncome.balance : walletIncomeCss.balance}>
            {Balance}
          </Text>
          <Text style={walletIncomeCss.label}>
            {i18n.t('WalletIncome.Total-Income')}
          </Text>
          <TextInput
            mode="outlined"
            style={isDark ? darkWalletIncome.Input : walletIncomeCss.Input}
            placeholder={i18n.t('WalletIncome.Income-Placeholder')}
            theme={isDark ? darkTheme : theme}
            onChangeText={text => setTotal(text)}
            textColor={isDark ? '#fff' : '#000'}
            keyboardType="numeric"
          />
          {TotalError !== '' && (
            <HelperText type="error" style={walletIncomeCss.InputError}>
              {TotalError}
            </HelperText>
          )}

          <Text style={walletIncomeCss.label}>
            {i18n.t('WalletIncome.Income-Type')}
          </Text>
          <SelectList
            setSelected={(text: string) => setSelectedType(text)}
            data={selectType}
            save="key"
            boxStyles={isDark ? darkWalletIncome.Input : walletIncomeCss.Input}
            inputStyles={{color: isDark ? '#fff' : '#000'}}
            dropdownStyles={
              isDark ? darkWalletIncome.Input : walletIncomeCss.Input
            }
            dropdownTextStyles={{color: isDark ? '#fff' : '#000'}}
            search={false}
            placeholder={i18n.t('WalletIncome.Type-Placeholder')}
          />
          {SelectTypeError !== '' && (
            <HelperText type="error" style={walletIncomeCss.InputError}>
              {SelectTypeError}
            </HelperText>
          )}

          <Text style={walletIncomeCss.label}>
            {i18n.t('WalletIncome.Date')}
          </Text>
          <TextInput
            mode="outlined"
            style={isDark ? darkWalletIncome.Input : walletIncomeCss.Input}
            theme={isDark ? darkTheme : theme}
            value={date.toDateString()}
            right={<TextInput.Icon icon="calendar" onPress={showDatepicker} />}
            editable={false}
            textColor={isDark ? '#fff' : '#000'}
          />
          {show && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
            />
          )}

          <TouchableOpacity
            style={walletIncomeCss.Button}
            onPress={() => validateNormal()}>
            <Text style={walletIncomeCss.ButtonText}>
              {i18n.t('WalletIncome.Save')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default BankIncome;
