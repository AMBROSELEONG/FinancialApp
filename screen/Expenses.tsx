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
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import {TextInput, HelperText, ProgressBar} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';
import i18n from '../language/language';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {darkBank, darkCss} from '../objects/darkCss';
import Toast from 'react-native-toast-message';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import BankDetail from './BankDetail';
import LinearGradient from 'react-native-linear-gradient';
import React, {useEffect, useState} from 'react';
import MainContainer from '../components/MainContainer';
import {css, debtCss} from '../objects/commonCss';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ExpenseDetails from './ExpensesDetail';

type Debt = {
  debtID: number;
  debtName: string;
  debtAmount: number;
  date: string;
  daysUntilNextDate: number;
  monthLeft: number;
};

type ItemProps = {
  debt: Debt;
};

const Expenses = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [UserId, setUserId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [TypeError, setTypeError] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [Amount, setAmount] = useState('');
  const [AmountError, setTAmountError] = useState('');
  const [Year, setYear] = useState('');
  const [YearError, setTYearError] = useState('');
  const [date, setDate] = useState(new Date());
  const [DateError, setDateError] = useState('');
  const [show, setShow] = useState(false);
  const [data, setData] = useState<Debt[]>([]);
  const [count, setCount] = useState(0);
  const [amount, setAmounts] = useState(0);
  const [Email, setEmail] = useState('');
  const [Token, setToken] = useState('');
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

  const theme = {
    roundness: 10,
    colors: {
      primary: '#000',
      outline: '#808080',
    },
  };

  const darkTheme = {
    roundness: 10,
    colors: {
      primary: '#3490DE',
      outline: '#808080',
    },
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    initialize();
    setSelectedType('');
    setAmount('');
    setYear('');
  };

  const selectType = [
    {key: '1', value: i18n.t('DebtList.Type1')},
    {key: '2', value: i18n.t('DebtList.Type2')},
    {key: '3', value: i18n.t('DebtList.Type3')},
    {key: '4', value: i18n.t('DebtList.Type4')},
    {key: '5', value: i18n.t('DebtList.Type5')},
    {key: '6', value: i18n.t('DebtList.Type6')},
    {key: '7', value: i18n.t('DebtList.Type7')},
    {key: '8', value: i18n.t('DebtList.Type8')},
    {key: '9', value: i18n.t('DebtList.Type9')},
    {key: '10', value: i18n.t('DebtList.Type10')},
    {key: '11', value: i18n.t('DebtList.Type11')},
    {key: '12', value: i18n.t('DebtList.Type12')},
    {key: '13', value: i18n.t('DebtList.Type13')},
  ];

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

  const fetchData = async (userId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Debt/GetDebt?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setCount(result.count);
        setAmounts(result.totalDebtAmount);
      }
    } catch (error) {
      ErrorToast(error);
    }
  };

  const fetchUserData = async (userId: any) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}User/GetUserData?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );

      const json = await response.json();

      if (json.success) {
        setEmail(json.userData.email);
        setToken(json.userData.token);
      }
    } catch (error) {
      ErrorToast(i18n.t('SettingPage.Error-Fetch'));
    }
  };

  const initialize = async () => {
    setLoading(true);
    try {
      const [savedTheme, storedUserID, storedToken] = await Promise.all([
        AsyncStorage.getItem('theme'),
        AsyncStorage.getItem('UserID'),
        AsyncStorage.getItem('Token'),
      ]);

      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }

      if (storedUserID) {
        setUserId(storedUserID);
        await fetchData(storedUserID);
        await fetchUserData(storedUserID);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const Validate = async () => {
    let isValid = true;
    const formattedDate = date.toISOString().split('T')[0];
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    if (!selectedType) {
      setTypeError(i18n.t('Debt.Debt-Empty'));
      isValid = false;
    } else {
      setTypeError('');
    }

    const total = parseFloat(Amount);
    if (!total) {
      setTAmountError(i18n.t('Debt.Amount-Empty'));
      isValid = false;
    } else if (isNaN(total)) {
      setTAmountError(i18n.t('Debt.Debt-Invalid'));
      isValid = false;
    } else {
      setTAmountError('');
    }

    const year = parseInt(Year);
    if (!year) {
      setTYearError(i18n.t('Debt.Repayment-Empty'));
      isValid = false;
    } else if (isNaN(year)) {
      setTYearError(i18n.t('Debt.Repayment-Invalid'));
    } else {
      setTYearError('');
    }

    if (!date || date > today) {
      setDateError(i18n.t('Debt.Date-Future'));
      isValid = false;
    } else {
      setDateError('');
    }

    if (isValid) {
      setLoading(true);
      console.log('Email' + Token);
      try {
        await RNFetchBlob.config({trusty: true})
          .fetch(
            'POST',
            `${UrlAccess.Url}Debt/CreateDebt`,
            {'Content-Type': 'application/json'},
            JSON.stringify({
              userID: UserId,
              debtName: selectedType,
              debtAmount: total,
              date: formattedDate,
              year: Year,
              email: Email,
              token: Token,
            }),
          )
          .then(response => response.json())
          .then(json => {
            if (json && json.success) {
              SuccessToast(i18n.t('Debt.AddSuccess'));
              toggleModal();
              initialize();
            } else {
              ErrorToast(i18n.t('Debt.AddFailed'));
            }
          });
      } catch (error) {
        ErrorToast('Error');
      } finally {
        setLoading(false);
      }
    }
  };
  const [locale, setLocale] = React.useState(i18n.locale);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
      initialize();
      setSelectedType('');
      setAmount('');
      setYear('');
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

  const Item: React.FC<ItemProps> = ({debt}: {debt: Debt}) => {
    const navigation = useNavigation();
    const formatDate = debt.date.toString().split('T')[0];
    const Date = formatDate.toString().split('-')[2];

    let suffix;
    if (parseInt(Date) > 3 && parseInt(Date) < 21) {
      suffix = 'th';
    } else {
      switch (parseInt(Date) % 10) {
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

    const navigateToExpenseDetails = () => {
      navigation.navigate(ExpenseDetails as never);
      AsyncStorage.setItem('DebtID', debt.debtID.toString());
      AsyncStorage.setItem('DebtName', debt.debtName);
    };

    return (
      <TouchableOpacity
        style={[
          debtCss.listContainer,
          {
            backgroundColor:
              debt.monthLeft < 0
                ? '#75B2E6'
                : debt.daysUntilNextDate < 7
                ? '#F37A7A'
                : isDark
                ? '#3A3A3A'
                : '#fff',
          },
        ]}
        onPress={navigateToExpenseDetails}>
        <View style={{marginHorizontal: 10, alignSelf: 'center'}}>
          <Image
            source={require('../assets/debt1.png')}
            style={debtCss.Image}
          />
        </View>
        <View style={{flex: 1, alignSelf: 'center'}}>
          <Text style={[debtCss.debtName, {color: isDark ? '#fff' : '#000'}]}>
            {typeMap[debt.debtName] || debt.debtName}
          </Text>
          <Text
            style={[
              debtCss.date,
              {
                color:
                  debt.monthLeft < 0
                    ? '#fff'
                    : debt.daysUntilNextDate < 7
                    ? '#fff'
                    : '#999999',
              },
            ]}>
            {Date}
            {suffix} {i18n.t('Debt.Per-Month')}
          </Text>
        </View>
        <View style={{alignSelf: 'center'}}>
          <Text style={debtCss.debtAmount}>RM {debt.debtAmount}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1, backgroundColor: isDark ? '#202020' : 'transparent'}}
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
          style={debtCss.linear}>
          <View style={[css.mainView, {backgroundColor: 'transparent'}]}>
            <TouchableOpacity
              style={{paddingLeft: 20}}
              onPress={() => {
                navigation.dispatch(DrawerActions.openDrawer());
              }}>
              <Ionicons name="menu" size={30} color={'#fff'} />
            </TouchableOpacity>
            <View style={css.HeaderView}>
              <Text style={[css.PageName, {color: '#fff'}]}>
                {i18n.t('Debt.Debt')}
              </Text>
            </View>
          </View>
          <Text style={debtCss.Title}>{i18n.t('Debt.Total-Amount')}</Text>
          <Text style={debtCss.Amount}>RM {amount.toFixed(2)}</Text>
          <Text style={debtCss.Number}>
            {i18n.t('Debt.Number-Debt')} {count}
          </Text>
        </LinearGradient>
        <View style={debtCss.debtList}>
          <Text style={[debtCss.LowerTitle, {color: isDark ? '#fff' : '#000'}]}>
            {i18n.t('Debt.Debt-List')}
          </Text>
        </View>
        <FlatList
          data={data}
          renderItem={({item}) => <Item debt={item} />}
          keyExtractor={item => item.debtID.toString()}
        />
        <TouchableOpacity
          style={[
            debtCss.addButton,
            {backgroundColor: isDark ? '#000' : '#fff'},
          ]}
          onPress={() => toggleModal()}>
          <Ionicons
            name="add-circle-outline"
            size={40}
            color={isDark ? '#fff' : '#000'}
            style={debtCss.addIcon}
          />
        </TouchableOpacity>
        {/**Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View
            style={[
              debtCss.ModalContainer,
              {backgroundColor: isDark ? '#000' : '#fff'},
            ]}>
            <TouchableOpacity
              style={debtCss.ButtonClose}
              onPress={() => toggleModal()}>
              <Ionicons name="close" size={30} color={'#999999'} />
            </TouchableOpacity>
            <Text
              style={[debtCss.ModalTitle, {color: isDark ? '#fff' : '#000'}]}>
              {i18n.t('Debt.Add-Debt')}
            </Text>
            <Text style={debtCss.label}>{i18n.t('Debt.Debt-Name')}</Text>
            <SelectList
              setSelected={(text: string) => setSelectedType(text)}
              data={selectType}
              save="key"
              boxStyles={[
                debtCss.Input,
                {backgroundColor: isDark ? '#000' : '#fff'},
              ]}
              inputStyles={{color: isDark ? '#fff' : '#000'}}
              dropdownStyles={[
                debtCss.Input,
                {backgroundColor: isDark ? '#000' : '#fff'},
              ]}
              dropdownTextStyles={{color: isDark ? '#fff' : '#000'}}
              search={true}
              placeholder={i18n.t('Debt.Debt-Name-Placeholder')}
              maxHeight={100}
            />
            {TypeError !== '' && (
              <HelperText type="error" style={debtCss.InputError}>
                {TypeError}
              </HelperText>
            )}

            <Text style={debtCss.label}>{i18n.t('Debt.Amount')}</Text>
            <TextInput
              mode="outlined"
              style={[
                debtCss.Input,
                {backgroundColor: isDark ? '#000' : '#fff'},
              ]}
              placeholder={i18n.t('Debt.Amount-Placeholder')}
              theme={isDark ? darkTheme : theme}
              onChangeText={text => setAmount(text)}
              textColor={isDark ? '#fff' : '#000'}
              value={Amount}
              keyboardType="numeric"
            />
            {AmountError !== '' && (
              <HelperText type="error" style={debtCss.InputError}>
                {AmountError}
              </HelperText>
            )}

            <Text style={debtCss.label}>
              {i18n.t('Debt.Monthly-Repayment')}
            </Text>
            <TextInput
              mode="outlined"
              style={[
                debtCss.Input,
                {backgroundColor: isDark ? '#000' : '#fff'},
              ]}
              theme={isDark ? darkTheme : theme}
              value={date.toDateString()}
              right={
                <TextInput.Icon icon="calendar" onPress={showDatepicker} />
              }
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
            {DateError !== '' && (
              <HelperText type="error" style={debtCss.InputError}>
                {DateError}
              </HelperText>
            )}

            <Text style={debtCss.label}>{i18n.t('Debt.Repayment-Years')}</Text>
            <TextInput
              mode="outlined"
              style={[
                debtCss.Input,
                {backgroundColor: isDark ? '#000' : '#fff'},
              ]}
              placeholder={i18n.t('Debt.Repayment-Years-Placeholder')}
              theme={isDark ? darkTheme : theme}
              onChangeText={text => setYear(text)}
              textColor={isDark ? '#fff' : '#000'}
              value={Year}
              keyboardType="numeric"
            />
            {YearError !== '' && (
              <HelperText type="error" style={debtCss.InputError}>
                {YearError}
              </HelperText>
            )}
            <TouchableOpacity
              style={debtCss.SaveButton}
              onPress={() => Validate()}>
              <Text style={debtCss.SaveText}>{i18n.t('Bank.Save')}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Expenses;
