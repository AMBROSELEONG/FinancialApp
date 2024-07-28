import React, {useState, useEffect} from 'react';
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
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {bankCss, css} from '../objects/commonCss';
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

type Bank = {
  bankID: number;
  userID: number;
  bankName: string;
  amount: number;
  balancePercentage: number;
};

type ItemProps = {
  bank: Bank;
};

type BankImagesType = Record<string, any>;

const Bank = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [Total, setTotal] = useState('');
  const [TotalError, setTotalError] = useState('');
  const [TypeError, setTypeError] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [UserId, setUserId] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Bank[]>([]);
  const [notData, setNotData] = useState(false);

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

  const toggleModal = () => {
    setModalVisible(!modalVisible);
    setSelectedType('');
    setTotal('');
    initialize();
  };

  const selectType = [
    {key: '1', value: 'MayBank'},
    {key: '2', value: 'CIMB Bank'},
    {key: '3', value: 'Public Bank Berhad'},
    {key: '4', value: 'RHB Bank Berhad'},
    {key: '5', value: 'Hong Leong Bank'},
    {key: '6', value: 'AmBank'},
    {key: '7', value: 'Affin Bank Berhad'},
    {key: '8', value: 'Alliance Bank Malaysia Berhad'},
    {key: '9', value: 'Bank Islam Malaysia Berhad'},
    {key: '10', value: 'Bank Muamalat Malaysia Berhad'},
    {key: '11', value: 'OCBC Bank (Malaysia) Berhad'},
    {key: '12', value: 'United Overseas Bank (Malaysia) Berhad'},
    {key: '13', value: 'Standard Chartered Bank Malaysia Berhad'},
    {key: '14', value: 'HSBC Bank Malaysia Berhad'},
    {key: '15', value: 'Citibank Berhad'},
    {key: '16', value: 'Maybank Islamic'},
    {key: '17', value: 'CIMB Islamic'},
    {key: '18', value: 'Public Islamic Bank'},
    {key: '19', value: 'RHB Islamic Bank'},
    {key: '20', value: 'Hong Leong Islamic Bank'},
    {key: '21', value: 'AmBank Islamic'},
    {key: '22', value: 'Affin Islamic Bank'},
    {key: '23', value: 'Alliance Islamic Bank'},
    {
      key: '24',
      value: 'Al Rajhi Banking & Investment Corporation (Malaysia) Berhad',
    },
  ];

  const fetchData = async (userId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Bank/GetBanks?userId=${userId}`,
        {'Content-Type': 'application/json'},
      );
      const result = await response.json();

      if (result.success) {
        setData(result.data);
        setNotData(false);
      } else {
        setNotData(true);
      }
    } catch (error) {
    }
  };

  const [bankBalance, setBankBalance] = useState('');
  const [percent, setPercent] = useState('');

  const fetchTotalBalance = async (userId: string) => {
    try {
      const response = await RNFetchBlob.config({trusty: true}).fetch(
        'GET',
        `${UrlAccess.Url}Bank/GetTotalBalance?userID=${userId}`,
        {'Content-Type': 'application/json'},
      );

      const result = await response.json();

      if (result.success) {
        setBankBalance(result.total.bankBalance.toFixed(2));
        setPercent(result.total.bankPercentage.toFixed(0));
      }
    } catch (error) {
    }
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
        setUserId(storedUserID);
        await fetchData(storedUserID);
        await fetchTotalBalance(storedUserID);
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
      initialize();
    }, []),
  );

  const validate = async () => {
    let isValid = true;
    const totalNumber = parseFloat(Total);

    if (!Total) {
      setTotalError(i18n.t('Bank.Total-Empty'));
      isValid = false;
    } else if (isNaN(totalNumber)) {
      setTotalError(i18n.t('Bank.Total-Invalid'));
      isValid = false;
    } else {
      setTotalError('');
    }

    if (!selectedType) {
      setTypeError(i18n.t('Bank.Bank-Empty'));
      isValid = false;
    } else {
      setTypeError('');
    }

    if (isValid) {
      setLoading(true);
      try {
        await RNFetchBlob.config({trusty: true})
          .fetch(
            'POST',
            `${UrlAccess.Url}Bank/AddBank`,
            {'Content-Type': 'application/json'},
            JSON.stringify({
              userID: UserId,
              bankName: selectedType,
              amount: Total,
            }),
          )
          .then(response => response.json())
          .then(json => {
            if (json && json.success) {
              SuccessToast(i18n.t('Bank.AddSuccess'));
              toggleModal();
            } else {
              ErrorToast(i18n.t('Bank.AddFailed'));
            }
          });
      } catch (error) {
        ErrorToast('Error');
      } finally {
        setLoading(false);
      }
    }
  };

  const bankImages: BankImagesType = {
    maybank: require('../assets/BankImage/maybank.png'),
    'cimb bank': require('../assets/BankImage/cimb.png'),
    'public bank berhad': require('../assets/BankImage/publicbank.png'),
    'rhb bank berhad': require('../assets/BankImage/rhbbank.png'),
    'hong leong bank': require('../assets/BankImage/hongleong.png'),
    ambank: require('../assets/BankImage/ambank.png'),
    'affin bank berhad': require('../assets/BankImage/affinbank.png'),
    'alliance bank malaysia berhad': require('../assets/BankImage/alliancebank.png'),
    'bank islam malaysia berhad': require('../assets/BankImage/bankislam.png'),
    'bank muamalat malaysia berhad': require('../assets/BankImage/bankmuamalat.png'),
    'ocbc bank (malaysia) berhad': require('../assets/BankImage/ocbcbank.png'),
    'united overseas bank (malaysia) berhad': require('../assets/BankImage/uob.png'),
    'standard chartered bank malaysia berhad': require('../assets/BankImage/standard.png'),
    'hsbc bank malaysia berhad': require('../assets/BankImage/hsbc.png'),
    'citibank berhad': require('../assets/BankImage/citibank.png'),
    'maybank islamic': require('../assets/BankImage/maybank.png'),
    'cimb islamic': require('../assets/BankImage/cimb.png'),
    'public islamic bank': require('../assets/BankImage/publicbank.png'),
    'rhb islamic bank': require('../assets/BankImage/rhbbank.png'),
    'hong leong islamic bank': require('../assets/BankImage/hongleong.png'),
    'ambank islamic': require('../assets/BankImage/ambank.png'),
    'affin islamic bank': require('../assets/BankImage/affinbank.png'),
    'alliance islamic bank': require('../assets/BankImage/alliancebank.png'),
    'al rajhi banking & investment corporation (malaysia) berhad': require('../assets/BankImage/alrajhi.jpg'),
  };

  const Item: React.FC<ItemProps> = ({bank}: {bank: Bank}) => {
    const navigation = useNavigation();

    const navigateToBankDetail = () => {
      navigation.navigate(BankDetail as never);
      AsyncStorage.setItem('BankID', bank.bankID.toString());
    };

    const standardizedBankName = bank.bankName
      .toLowerCase()
      .replace(/\s+/g, ' ');
    const bankImage = bankImages[standardizedBankName];

    return (
      <TouchableOpacity
        style={isDark ? darkBank.listContainer : bankCss.listContainer}
        onPress={navigateToBankDetail}>
        <View style={{flex: 1.5, alignSelf: 'center'}}>
          {bankImage ? (
            <Image source={bankImage} style={bankCss.BankImage} />
          ) : (
            <Text>Image not found</Text>
          )}
        </View>
        <View style={{flex: 5, alignSelf: 'center'}}>
          <Text style={isDark ? darkBank.bank : bankCss.bank}>
            {bank.bankName}
          </Text>
          <Text style={isDark? darkBank.balance : bankCss.balance}>RM {bank.amount.toFixed(2)}</Text>
        </View>
        <View style={{flex: 1, alignSelf: 'center'}}>
          <Text style={bankCss.percent}>
            {bank.balancePercentage.toFixed(0)}%
          </Text>
        </View>
      </TouchableOpacity>
    );
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

  if (notData) {
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
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <Ionicons name="menu" size={30} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={isDark ? darkCss.PageName : css.PageName}>
              {i18n.t('Bank.Bank')}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={isDark ? darkBank.addButton : bankCss.addButton}
          onPress={() => toggleModal()}>
          <Ionicons
            name="add-circle-outline"
            size={40}
            color={isDark ? '#fff' : '#000'}
            style={bankCss.addIcon}
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
          <View style={bankCss.ModalContainer}>
            <View style={isDark ? darkBank.ModalView : bankCss.ModalView}>
              <TouchableOpacity
                style={bankCss.ButtonClose}
                onPress={() => toggleModal()}>
                <Ionicons name="close" size={30} color={'#999999'} />
              </TouchableOpacity>
              <Text style={isDark ? darkBank.ModalTitle : bankCss.ModalTitle}>
                {i18n.t('Bank.Add-Bank')}
              </Text>
              <Text style={bankCss.label}>{i18n.t('Bank.Bank-Name')}</Text>
              <SelectList
                setSelected={(text: string) => setSelectedType(text)}
                data={selectType}
                save="value"
                boxStyles={isDark ? darkBank.Input : bankCss.Input}
                inputStyles={{color: isDark ? '#fff' : '#000'}}
                dropdownStyles={isDark ? darkBank.Input : bankCss.Input}
                dropdownTextStyles={{color: isDark ? '#fff' : '#000'}}
                search={true}
                placeholder={i18n.t('Bank.Add-Bank-Placeholder')}
                maxHeight={100}
              />
              {TypeError !== '' && (
                <HelperText type="error" style={bankCss.InputError}>
                  {TypeError}
                </HelperText>
              )}

              <Text style={bankCss.label}>
                {i18n.t('Bank.Initial-Balance')}
              </Text>
              <TextInput
                mode="outlined"
                style={isDark ? darkBank.Input : bankCss.Input}
                placeholder={i18n.t('Bank.Initial-Balance-Placeholder')}
                theme={isDark ? darkTheme : theme}
                onChangeText={text => setTotal(text)}
                textColor={isDark ? '#fff' : '#000'}
                value={Total}
                keyboardType="numeric"
              />
              {TotalError !== '' && (
                <HelperText type="error" style={bankCss.InputError}>
                  {TotalError}
                </HelperText>
              )}

              <TouchableOpacity
                style={bankCss.SaveButton}
                onPress={() => validate()}>
                <Text style={bankCss.SaveText}>{i18n.t('Bank.Save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{flex: 1, backgroundColor: isDark ? '#202020' : '#fff'}}>
          <LinearGradient
            style={bankCss.upperContainer}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#1C4E78', '#3490DE']}>
            <View style={bankCss.leftContent}>
              <Text style={bankCss.TotalBalance}>{i18n.t('BankDetail.Total')}</Text>
              <Text style={bankCss.Balance}>RM {bankBalance}</Text>
              {percent ? (
                <ProgressBar
                  progress={parseFloat(percent) / 100}
                  color="#fff"
                  style={bankCss.ProgressBar}
                />
              ) : (
                <View></View>
              )}
            </View>
            <View style={bankCss.rightContent}>
              <Image
                source={require('../assets/whitediagram.png')}
                style={bankCss.Image}
              />
              <Text
                style={[
                  bankCss.TotalBalance,
                  {
                    marginVertical:
                      (Dimensions.get('screen').height / 100) * 1.6,
                  },
                ]}>
                {percent}%
              </Text>
            </View>
          </LinearGradient>
          <Text style={bankCss.List}>{i18n.t('BankDetail.Bank-List')}</Text>
          <View style={[bankCss.bottomContainer,{backgroundColor: isDark ? '#202020' : '#fff'}]}>
            <FlatList
              data={data}
              renderItem={({item}) => <Item bank={item} />}
              keyExtractor={item => item.bankID.toString()}
              scrollEnabled={true}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Bank;
