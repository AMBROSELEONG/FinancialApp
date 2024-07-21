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
  Alert,
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

type Bank = {
  bankID: number;
  bankName: string;
};

const WalletIncome = () => {
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
  const [selectBank, setSelectBank] = useState<{key: string; value: string}[]>(
    [],
  );
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [SelectTypeError, setSelectTypeError] = useState('');
  const [SelectBankError, setSelectBankError] = useState('');

  const selectType = [
    {key: '1', value: i18n.t('IncomeType.Type1')},
    {key: '2', value: i18n.t('IncomeType.Type2')},
    {key: '3', value: i18n.t('IncomeType.Type3')},
    {key: '4', value: i18n.t('IncomeType.Type4')},
    {key: '5', value: i18n.t('IncomeType.Type5')},
    {key: '6', value: i18n.t('IncomeType.Type6')},
    {key: '7', value: i18n.t('IncomeType.Type7')},
    {key: '8', value: i18n.t('IncomeType.Type8')},
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
  const [Balance, setBalance] = useState(null);
  const [walletID, setWalletID] = useState('');
  const [bankBalance, setBankBalance] = useState(null);

  const fetchData = async (UserID: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Wallet/GetWallet?userID=${UserID}`,
        {'Content-Type': 'application/json'},
      );
      const json = await response.json();

      if (json.success) {
        setBalance(json.walletData.balance.toFixed(2));
      } else {
        ErrorToast(i18n.t('SettingPage.Failed-Fetch-Data'));
      }
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Error-Fetch'));
    }
  };

  const fetchBankData = async (
    userId: string,
    setSelectBank: React.Dispatch<
      React.SetStateAction<{key: string; value: string}[]>
    >,
  ) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Bank/GetBanks?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );
      const result = await response.json();

      if (result.success) {
        const banks = result.data.map((bank: Bank) => ({
          key: bank.bankID.toString(),
          value: bank.bankName,
        }));
        setSelectBank(banks);
      }
    } catch (error) {
      ErrorToast('error' + error);
    }
  };

  const initialize = async () => {
    setLoading(true);

    try {
      const [savedTheme, storedUserID, walletID] = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('UserID'),
        AsyncStorage.getItem('WalletID'),
      ]);

      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }

      if (storedUserID) {
        setUserId(storedUserID);
        await fetchData(storedUserID);
        await fetchBankData(storedUserID, setSelectBank);
      }

      if (walletID) {
        setWalletID(walletID);
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

  const [locale, setLocale] = React.useState(i18n.locale);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
      setTotal('');
      setSelectedType('');
      setSelectedBank('');
    }, []),
  );

  const validateNormal = async () => {
    let isValid = true;
    const amount = parseFloat(Total);

    if (!amount) {
      setTotalError(i18n.t('Bank.Total-Empty'));
      isValid = false;
    } else if (isNaN(amount) || amount <= 0) {
      setTotalError(i18n.t('Bank.Total-Invalid'));
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
      if (userID && walletID && amount && selectedType && formattedDate) {
        try {
          await RNFetchBlob.config({trusty: true})
            .fetch(
              'POST',
              `${UrlAccess.Url}WalletIncome/AddIncome`,
              {'Content-Type': 'application/json'},
              JSON.stringify({
                walletID: walletID,
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

  const validateBank = async () => {
    let isValid = true;
    const amount = parseFloat(Total);

    if (!amount) {
      setTotalError(i18n.t('Bank.Total-Empty'));
      isValid = false;
    } else if (isNaN(amount) || amount <= 0) {
      setTotalError(i18n.t('Bank.Total-Invalid'));
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

    if (!selectedBank) {
      setSelectBankError(i18n.t('WalletIncome.Bank-Empty'));
      isValid = false;
    }

    if (isValid) {
      setLoading(true);
      const formattedDate = date.toISOString().split('T')[0];
      if (
        userID &&
        walletID &&
        amount &&
        selectedType &&
        formattedDate &&
        selectedBank
      ) {
        try {
          const response = await RNFetchBlob.config({trusty: true}).fetch(
            'GET',
            `${UrlAccess.Url}Bank/GetBanksByBankID?bankId=${selectedBank}`,
            {'Content-Type': 'application/json'},
          );

          const json = await response.json();

          if (json.success) {
            setBankBalance(json.data.amount);
            if (json.data.amount < amount) {
              Alert.alert(
                i18n.t('WalletIncome.Alert'),
                i18n.t('WalletIncome.Alert-Text'),
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setTotal(''), setSelectedType(''), setSelectedBank('');
                    },
                  },
                ],
              );
            } else {
              try {
                await RNFetchBlob.config({trusty: true})
                  .fetch(
                    'POST',
                    `${UrlAccess.Url}WalletIncome/AddIncomeWithBank`,
                    {'Content-Type': 'application/json'},
                    JSON.stringify({
                      walletID: walletID,
                      userID: userID,
                      bankID: selectedBank,
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
              } finally {
                setLoading(false);
              }
            }
          } else {
            ErrorToast(i18n.t('WalletIncome.Fail'));
          }
        } finally {
          setLoading(false);
        }
      } else {
        ErrorToast(i18n.t('WalletIncome.Fail'));
      }
    } else {
      initialize();
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
            {i18n.t('WalletIncome.Fill')}
          </Text>
          <Text style={walletIncomeCss.subtitle}>
            {i18n.t('WalletIncome.Balance')}
          </Text>
          <Text
            style={isDark ? darkWalletIncome.balance : walletIncomeCss.balance}>
            RM {Balance}
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
          {selectedType === '8' && (
            <View>
              <Text style={walletIncomeCss.label}>
                {i18n.t('WalletIncome.Bank')}
              </Text>
              <SelectList
                setSelected={(text: string) => setSelectedBank(text)}
                data={selectBank}
                save="key"
                boxStyles={
                  isDark ? darkWalletIncome.Input : walletIncomeCss.Input
                }
                inputStyles={{color: isDark ? '#fff' : '#000'}}
                dropdownStyles={
                  isDark ? darkWalletIncome.Input : walletIncomeCss.Input
                }
                dropdownTextStyles={{color: isDark ? '#fff' : '#000'}}
                search={false}
                placeholder={i18n.t('WalletIncome.Bank-Placeholder')}
              />
              {SelectBankError !== '' && (
                <HelperText type="error" style={walletIncomeCss.InputError}>
                  {SelectBankError}
                </HelperText>
              )}
            </View>
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
            onPress={() =>
              selectedType === '8'
                ? validateBank()
                : validateNormal()
            }>
            <Text style={walletIncomeCss.ButtonText}>
              {i18n.t('WalletIncome.Save')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default WalletIncome;
