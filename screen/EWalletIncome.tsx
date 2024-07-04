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

const EWalletIncome = () => {
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
  const [selectedBank, setSelectedBank] = useState<string>('');

  const selectType = [
    {key: '1', value: 'Wages/Salary'},
    {key: '2', value: 'Bonuses'},
    {key: '3', value: 'Investment Income'},
    {key: '4', value: 'Interest Income'},
    {key: '5', value: 'Rental Income'},
    {key: '6', value: 'Self-Employment Income'},
    {key: '7', value: 'Gifts'},
    {key: '8', value: 'Bank Transfer'},
    {key: '9', value: 'Other Income'},
  ];

  const selectBank = [
    {key: '1', value: 'Public Bank'},
    {key: '2', value: 'Hong Leong Bank'},
    {key: '3', value: 'AmBank'},
    {key: '4', value: 'Bank Islam'},
    {key: '5', value: 'Rental Income'},
    {key: '6', value: 'Self-Employment Income'},
    {key: '7', value: 'Gifts'},
    {key: '8', value: 'Bank Transfer'},
    {key: '9', value: 'Other Income'},
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

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      ErrorToast(i18n.t('Fail-Load-Theme'));
    }
  };

  const initialize = async () => {
    setLoading(true);
    try {
      await Promise.all([loadTheme()]);
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
    }, []),
  );

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
            {i18n.t('EwalletIncome.Fill')}
          </Text>
          <Text style={walletIncomeCss.subtitle}>
            {i18n.t('WalletIncome.Balance')}
          </Text>
          <Text
            style={isDark ? darkWalletIncome.balance : walletIncomeCss.balance}>
            RM 100
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
            save="value"
            boxStyles={isDark ? darkWalletIncome.Input : walletIncomeCss.Input}
            inputStyles={{color: isDark ? '#fff' : '#000'}}
            dropdownStyles={
              isDark ? darkWalletIncome.Input : walletIncomeCss.Input
            }
            dropdownTextStyles={{color: isDark ? '#fff' : '#000'}}
            search={false}
            placeholder={i18n.t('WalletIncome.Type-Placeholder')}
          />
          {selectedType === 'Bank Transfer' && (
            <View>
              <Text style={walletIncomeCss.label}>
                {i18n.t('WalletIncome.Bank')}
              </Text>
              <SelectList
                setSelected={(text: string) => setSelectedBank(text)}
                data={selectBank}
                save="value"
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

          <TouchableOpacity style={walletIncomeCss.Button}>
            <Text style={walletIncomeCss.ButtonText}>
              {i18n.t('WalletIncome.Save')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default EWalletIncome;
