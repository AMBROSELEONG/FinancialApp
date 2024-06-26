import MainContainer from '../components/MainContainer';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
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

const WalletSpend = () => {
  const navigation = useNavigation();

  const theme = {
    roundness: 10, // Set the border radius here
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

  const [Total, setTotal] = useState('');
  const [TotalError, setTotalError] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('');

  const selectType = [
    {key: '1', value: 'Housing'},
    {key: '2', value: 'Transportation'},
    {key: '3', value: 'Food'},
    {key: '4', value: 'Entertainment'},
    {key: '5', value: 'Medical'},
    {key: '6', value: 'Education'},
    {key: '7', value: 'Clothing'},
    {key: '8', value: 'Insurance'},
    {key: '9', value: 'Save In Bank'},
    {key: '10', value: 'Other'},
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

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    })();
  }, []);

  const [locale, setLocale] = React.useState(i18n.locale);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

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
              {i18n.t('WalletSpend.Spend')}
            </Text>
          </View>
        </View>
        <View 
          style={
            isDark ? darkWalletIncome.container : walletIncomeCss.container
          }>
          <Text style={isDark ? darkWalletIncome.title : walletIncomeCss.title}>
            {i18n.t('WalletSpend.Fill')}
          </Text>
          <Text style={walletIncomeCss.subtitle}>
            {i18n.t('WalletSpend.Balance')}
          </Text>
          <Text
            style={isDark ? darkWalletIncome.balance : walletIncomeCss.balance}>
            RM 100
          </Text>
          <Text style={walletIncomeCss.label}>
            {i18n.t('WalletSpend.Total-Spend')}
          </Text>
          <TextInput
            mode="outlined"
            style={isDark ? darkWalletIncome.Input : walletIncomeCss.Input}
            placeholder={i18n.t('WalletSpend.Spend-Placeholder')}
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
            {i18n.t('WalletSpend.Spend-Type')}
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
            placeholder={i18n.t('WalletSpend.Type-Placeholder')}
          />
          {selectedType === 'Save In Bank' && (
            <View>
              <Text style={walletIncomeCss.label}>
                {i18n.t('WalletSpend.Bank')}
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
                placeholder={i18n.t('WalletSpend.Bank-Placeholder')}
              />
            </View>
          )}

          <Text style={walletIncomeCss.label}>
            {i18n.t('WalletSpend.Date')}
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
              {i18n.t('WalletSpend.Save')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default WalletSpend;
