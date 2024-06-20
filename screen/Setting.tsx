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

const Setting = () => {
  const navigation = useNavigation();
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const [UserName, setUsername] = useState('');
  const [Email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [locale, setLocale] = React.useState(i18n.locale);

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
    useCallback(() => {
      if (isFocused && userId) {
        setLoading(true);
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
            } else {
              showToast(i18n.t('SettingPage.Failed-Fetch-Data'));
            }
          } catch (error) {
            showToast(i18n.t('SettingPage.Error-Fetch'));
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }
    }, [isFocused, userId]),
  );

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
          backgroundColor="#F9F9F9"
          barStyle={'dark-content'}
        />
        {loading ? (
          <View
            style={{
              flex: 1,
              marginVertical: (Dimensions.get('screen').height / 100) * 50,
            }}>
            <ActivityIndicator size={80} color="#000000" />
          </View>
        ) : (
          <View>
            <View style={[css.mainView, {backgroundColor: '#F9F9F9'}]}>
              <TouchableOpacity
                style={{paddingLeft: 20}}
                onPress={() => {
                  navigation.dispatch(DrawerActions.openDrawer());
                }}>
                <Ionicons name="menu" size={30} color={'#000'} />
              </TouchableOpacity>
              <View style={css.HeaderView}>
                <Text style={css.PageName}>
                  {i18n.t('SettingPage.Setting')}
                </Text>
              </View>
            </View>
            <View style={settingCss.container}>
              <View style={settingCss.UserContainer}>
                <Image
                  source={require('../assets/User.png')}
                  style={[settingCss.UserImage]}
                />
                <View style={settingCss.UserInfoContainer}>
                  <Text style={settingCss.UserName}>{UserName}</Text>
                  <Text style={settingCss.Email}>{Email}</Text>
                </View>
              </View>
              <View style={settingCss.EditContainer}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../assets/edit.png')}
                    style={[settingCss.EditIcon]}
                  />
                  <View style={settingCss.TextContainer}>
                    <Text style={settingCss.text}>
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
              <View style={settingCss.PrefenceContainer}>
                <Text style={settingCss.PrefenceText}>
                  {i18n.t('SettingPage.Preferences')}
                </Text>
                <TouchableOpacity
                  style={settingCss.FunctionContainer}
                  onPress={() => navigation.navigate(Language as never)}>
                  <View style={{flexDirection: 'row'}}>
                    <Ionicons
                      name="language"
                      size={30}
                      color={'#000'}
                      style={[settingCss.EditIcon, {borderWidth: 0}]}
                    />
                    <View style={settingCss.TextContainer}>
                      <Text style={settingCss.text}>
                        {i18n.t('SettingPage.Language')}
                      </Text>
                    </View>
                  </View>
                  <View style={settingCss.ClickIcon}>
                    <FontAwesome5 name="angle-right" size={30} color={'#000'} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={settingCss.FunctionContainer}>
                  <View style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcons
                      name="theme-light-dark"
                      size={30}
                      color={'#000'}
                      style={[settingCss.EditIcon, {borderWidth: 0}]}
                    />
                    <View style={settingCss.TextContainer}>
                      <Text style={settingCss.text}>
                        {i18n.t('SettingPage.Dark-Mode')}
                      </Text>
                    </View>
                  </View>
                  <View style={settingCss.ClickIcon}>
                    <Switch
                      trackColor={{false: '#81b0ff', true: '#767577'}}
                      thumbColor={isEnabled ? '#f4f3f4' : '#f5dd4b'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Setting;
