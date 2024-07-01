import React, {useState, useEffect, useCallback} from 'react';
import MainContainer from '../components/MainContainer';
import {
  useNavigation,
  DrawerActions,
  useFocusEffect,
  CommonActions,
} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  Switch,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {css, settingCss} from '../objects/commonCss';
import Language from './Language';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserEdit from './UserEdit';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import i18n from '../language/language';
import Toast from 'react-native-toast-message';
import ReactNativeBiometrics, {BiometryTypes} from 'react-native-biometrics';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {useTheme} from '../objects/ThemeProvider';
import {darkCss, darkSetting} from '../objects/darkCss';
import CustomDrawer from './CustomDrawer';
import ThemeChange from './ThemeChange';
const STORAGE_KEY = '@app_language';

const Setting = () => {
  const navigation = useNavigation();
  const [isFingerEnabled, setFingerIsEnabled] = useState(false);
  const [FingerAvailable, setFingerAvailable] = useState(false);
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [UserName, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = React.useState(i18n.locale);
  const rnBiometrics = new ReactNativeBiometrics();

  const showToast = (message: any) => {
    Toast.show({
      type: 'error',
      text1: message,
      visibilityTime: 3000,
    });
  };

  useEffect(() => {
    setLoading(true);
    const fetchUsername = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem('UserID');
        if (storedUserID !== null) {
          setUserId(storedUserID);
        }
      } catch (error) {
        showToast(i18n.t('SettingPage.Failed-Load-Username'));
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
    setLoading(true);
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await RNFetchBlob.config({trusty: true}).fetch(
            'GET',
            `${UrlAccess.Url}User/GetUserData?userId=${userId}`,
            {'Content-Type': 'application/json'},
          );

          const json = await response.json();

          if (json.success) {
            setEmail(json.userData.email);
            setUsername(json.userData.userName);
            setLoading(false);
          } else {
            showToast(i18n.t('SettingPage.Failed-Fetch-Data'));
          }
        } catch (error) {
          showToast(i18n.t('SettingPage.Error-Fetch'));
        }
      };
      fetchData();
    }
  }, [userId]);

  useFocusEffect(
    React.useCallback(() => {
      setLocale(i18n.locale);
    }, []),
  );

  const loadLanguage = async () => {
    setLoading(true);
    try {
      const language = await AsyncStorage.getItem(STORAGE_KEY);
      if (language) {
        i18n.locale = language;
        setLocale(language);
      }
    } catch (error) {
      console.error('Failed to load language', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLanguage();
    }, []),
  );

  useEffect(() => {
    rnBiometrics
      .isSensorAvailable()
      .then(resultObject => {
        const {available, biometryType} = resultObject;

        if (available && biometryType === BiometryTypes.Biometrics) {
          setFingerAvailable(true);
        } else {
          setFingerAvailable(false);
        }
      })
      .catch(error => {
        setFingerAvailable(false);
      });
  }, []);

  const sendFingerPrintStatusToServer = async (status: any) => {
    try {
      await RNFetchBlob.config({trusty: true}).fetch(
        'POST',
        UrlAccess.Url + 'User/FingerPrint',
        {'Content-Type': 'application/json'},
        JSON.stringify({
          userId: userId,
          fingerPrint: status,
        }),
      );
    } catch (error) {
      showToast('Failed to send fingerprint status to server');
    }
  };

  const [PublicKey, setPublicKey] = useState('');
  const [Signature, setSignature] = useState('');
  const fingerSwitch = async () => {
    setLoading(true);
    setFingerIsEnabled(previousState => {
      const newState = !previousState;
      sendFingerPrintStatusToServer(newState);
      if (newState) {
        rnBiometrics.createKeys().then(resultObject => {
          const {publicKey} = resultObject;
          fingerPrintRegister(newState);
          setPublicKey(publicKey);
          if (PublicKey) {
            updatePublicKey();
          }
        });
      } else {
        rnBiometrics.deleteKeys().then(resultObject => {
          const {keysDeleted} = resultObject;

          if (keysDeleted) {
            showToast(i18n.t('SettingPage.Disable-Finger-Successful'));
            setLoading(false);
          } else {
            showToast(
              'Unsuccessful deletion because there were no keys to delete',
            );
          }
        });
      }
      return newState;
    });
  };

  const fingerPrintRegister = async (status: any) => {
    let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
    let payload = epochTimeSeconds + 'some message';
    if (status) {
      try {
        rnBiometrics
          .createSignature({
            promptMessage: 'Register Finger Print',
            payload: payload,
            cancelButtonText: 'Cancel',
          })
          .then(resultObject => {
            const {success, signature} = resultObject;
            if (success) {
              setSignature(signature!);
              showToast(i18n.t('SettingPage.Enable-Finger-Successful'));
              setLoading(false);
              if (Signature) {
                updateSignature();
              }
            }
          })
          .catch(error => {
            showToast(error);
          });
      } catch (error) {
        showToast(error);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      const getFingerPrintStatus = async () => {
        try {
          const response = await RNFetchBlob.config({trusty: true}).fetch(
            'GET',
            `${UrlAccess.Url}User/GetFingerPrint?userId=${userId}`,
            {'Content-Type': 'application/json'},
          );

          const data = await response.json();
          if (data.success) {
            setFingerIsEnabled(data.userData.fingerPrint);
          } else {
            showToast('Failed to fetch fingerprint status');
          }
        } catch (error) {
          showToast('Error fetching fingerprint status');
        }
      };
      getFingerPrintStatus();
    }
  }, [userId]);

  const updatePublicKey = async () => {
    try {
      await RNFetchBlob.config({trusty: true}).fetch(
        'POST',
        UrlAccess.Url + 'User/UpdatePublicKey',
        {'Content-Type': 'application/json'},
        JSON.stringify({
          userId: userId,
          publicKey: PublicKey,
        }),
      );
    } catch (error) {
      showToast('Failed to send public key status to server');
    }
  };

  const updateSignature = async () => {
    try {
      await RNFetchBlob.config({trusty: true}).fetch(
        'POST',
        UrlAccess.Url + 'User/updateSignature',
        {'Content-Type': 'application/json'},
        JSON.stringify({
          userId: userId,
          signature: Signature,
        }),
      );
    } catch (error) {
      showToast('Failed to send public key status to server');
    }
  };

  const {isDark, toggleTheme} = useTheme();
  const Style = isDark ? settingCss : darkSetting;

  const toggleSwitch = async () => {
    toggleTheme();
    console.log(isDark ? 'light' : 'dark');

    navigation.navigate(ThemeChange as never);
  };

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar
          animated={true}
          backgroundColor={isDark ? '#000' : '#F9F9F9'}
          barStyle={'dark-content'}
        />
        {loading ? (
          <View
            style={{
              flex: 1,
              marginVertical: (Dimensions.get('screen').height / 100) * 50,
              backgroundColor: isDark ? '#000' : '#fff',
            }}>
            <ActivityIndicator size={80} color={isDark ? '#fff' : '#000'} />
          </View>
        ) : (
          <View style={{backgroundColor: isDark ? '#000' : '#f9f9f9', flex: 1}}>
            <View
              style={[
                css.mainView,
                {backgroundColor: isDark ? '#000' : '#F9F9F9'},
              ]}>
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
                  {i18n.t('SettingPage.Setting')}
                </Text>
              </View>
            </View>
            <View style={isDark ? darkSetting.container : settingCss.container}>
              <View
                style={
                  isDark ? darkSetting.UserContainer : settingCss.UserContainer
                }>
                <Image
                  source={require('../assets/User.png')}
                  style={[settingCss.UserImage]}
                />
                <View style={settingCss.UserInfoContainer}>
                  <Text
                    style={isDark ? darkSetting.UserName : settingCss.UserName}>
                    {UserName}
                  </Text>
                  <Text style={isDark ? darkSetting.Email : settingCss.Email}>
                    {Email}
                  </Text>
                </View>
              </View>
              <View
                style={
                  isDark ? darkSetting.EditContainer : settingCss.EditContainer
                }>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={
                      isDark
                        ? require('../assets/whiteedit.png')
                        : require('../assets/edit.png')
                    }
                    style={[settingCss.EditIcon]}
                  />
                  <View style={settingCss.TextContainer}>
                    <Text style={isDark ? darkSetting.text : settingCss.text}>
                      {i18n.t('SettingPage.Edit-Profile')}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={settingCss.EditButton}
                  onPress={() => {
                    navigation.navigate(UserEdit as never);
                  }}>
                  <Text style={settingCss.ButtonText}>
                    {i18n.t('SettingPage.Edit')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={
                  isDark
                    ? darkSetting.PrefenceContainer
                    : settingCss.PrefenceContainer
                }>
                <Text
                  style={
                    isDark ? darkSetting.PrefenceText : settingCss.PrefenceText
                  }>
                  {i18n.t('SettingPage.Preferences')}
                </Text>

                <TouchableOpacity
                  style={settingCss.FunctionContainer}
                  onPress={() => navigation.navigate(Language as never)}>
                  <View style={{flexDirection: 'row'}}>
                    <Ionicons
                      name="language"
                      size={30}
                      color={isDark ? '#fff' : '#000'}
                      style={[settingCss.EditIcon, {borderWidth: 0}]}
                    />
                    <View style={settingCss.TextContainer}>
                      <Text style={isDark ? darkSetting.text : settingCss.text}>
                        {i18n.t('SettingPage.Language')}
                      </Text>
                    </View>
                  </View>
                  <View style={settingCss.ClickIcon}>
                    <FontAwesome5
                      name="angle-right"
                      size={30}
                      color={isDark ? '#fff' : '#000'}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableWithoutFeedback onPress={toggleSwitch}>
                  <View style={settingCss.FunctionContainer}>
                    <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons
                        name="theme-light-dark"
                        size={30}
                        color={isDark ? '#fff' : '#000'}
                        style={[settingCss.EditIcon, {borderWidth: 0}]}
                      />
                      <View style={settingCss.TextContainer}>
                        <Text
                          style={isDark ? darkSetting.text : settingCss.text}>
                          {i18n.t('SettingPage.Dark-Mode')}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      trackColor={{false: '#81b0ff', true: '#767577'}}
                      thumbColor={isDark ? '#f4f3f4' : '#f5dd4b'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isDark}
                      style={settingCss.ClickIcon}
                    />
                  </View>
                </TouchableWithoutFeedback>

                {FingerAvailable ? (
                  <TouchableWithoutFeedback onPress={fingerSwitch}>
                    <View style={settingCss.FunctionContainer}>
                      <View style={{flexDirection: 'row'}}>
                        <MaterialCommunityIcons
                          name="fingerprint"
                          size={30}
                          color={isDark ? '#fff' : '#000'}
                          style={[settingCss.EditIcon, {borderWidth: 0}]}
                        />
                        <View style={settingCss.TextContainer}>
                          <Text
                            style={isDark ? darkSetting.text : settingCss.text}>
                            {i18n.t('SettingPage.Finger-Print')}
                          </Text>
                        </View>
                      </View>
                      <Switch
                        trackColor={{false: '#81b0ff', true: '#767577'}}
                        thumbColor={isFingerEnabled ? '#f4f3f4' : '#f5dd4b'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={fingerSwitch}
                        value={isFingerEnabled}
                        style={settingCss.ClickIcon}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                ) : (
                  <View></View>
                )}
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Setting;
