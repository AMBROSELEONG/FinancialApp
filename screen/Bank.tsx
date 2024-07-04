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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {bankCss, css} from '../objects/commonCss';
import {TextInput, HelperText} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';
import BankDetail from './BankDetail';
import i18n from '../language/language';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {darkBank, darkCss} from '../objects/darkCss';
import Toast from 'react-native-toast-message';

const Bank = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [Total, setTotal] = useState('');
  const [TotalError, setTotalError] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

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

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      bank: 'First Item',
      balance: 'RM 200',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      bank: 'Second Item',
      balance: 'RM 200',
    },
  ];

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

  type ItemProps = {id: string; bank: string; balance: string};

  const Item = ({id, bank, balance}: ItemProps) => (
    <TouchableOpacity
      style={isDark ? darkBank.listContainer : bankCss.listContainer}
      onPress={() => {
        console.log(id);
        navigation.navigate(BankDetail as never);
      }}>
      <Text style={isDark ? darkBank.bank : bankCss.bank}>{bank}</Text>
      <Text style={bankCss.balance}>{balance}</Text>
    </TouchableOpacity>
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
          onPress={() => setModalVisible(!modalVisible)}>
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
                onPress={() => setModalVisible(!modalVisible)}>
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
                search={false}
                placeholder={i18n.t('Bank.Add-Bank-Placeholder')}
                maxHeight={100}
              />

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
              />
              {TotalError !== '' && (
                <HelperText type="error" style={bankCss.InputError}>
                  {TotalError}
                </HelperText>
              )}

              <TouchableOpacity style={bankCss.SaveButton}>
                <Text style={bankCss.SaveText}>{i18n.t('Bank.Save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{flex: 1, backgroundColor: isDark ? '#202020' : '#fff'}}>
          <FlatList
            data={DATA}
            renderItem={({item}) => (
              <Item id={item.id} bank={item.bank} balance={item.balance} />
            )}
            keyExtractor={item => item.id}
            scrollEnabled={true}
          />
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Bank;
