import MainContainer from '../components/MainContainer';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, languageCss} from '../objects/commonCss';
import React, {useCallback, useEffect, useState} from 'react';
import i18n from '../language/language';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeChange from './ThemeChange';
import {darkCss, darkLanguage} from '../objects/darkCss';
import Toast from 'react-native-toast-message';

const STORAGE_KEY = '@app_language';

const Language = () => {
  const navigation = useNavigation();
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
  const [selectedLanguage, setSelectedLanguage] = React.useState(i18n.locale);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    loadLanguage();
  }, [isFocused]);

  const loadLanguage = async () => {
    try {
      const language = await AsyncStorage.getItem(STORAGE_KEY);
      if (language) {
        i18n.locale = language;
        setSelectedLanguage(language);
      }
    } catch (error) {
      ErrorToast(i18n.t('Fail-Load-Language'));
    }
  };

  const saveLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      ErrorToast(i18n.t('LanguagePage.Fail-Save-Language'));
    }
  };

  const changeLanguage = async (language: string) => {
    i18n.locale = language;
    setSelectedLanguage(language);
    saveLanguage(language);
    showLanguageUpdateAlert();
  };

  const showLanguageUpdateAlert = () => {
    navigation.navigate(ThemeChange as never);
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
              {i18n.t('LanguagePage.Change-Language')}
            </Text>
          </View>
        </View>
        <View style={isDark ? darkLanguage.container : languageCss.container}>
          <TouchableOpacity
            style={languageCss.languageContainer}
            onPress={() => {
              changeLanguage('en');
            }}>
            <Text style={isDark ? darkLanguage.text : languageCss.text}>
              English
            </Text>
            {selectedLanguage === 'en' && (
              <Image
                source={require('../assets/tick.png')}
                style={languageCss.tick}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={languageCss.languageContainer}
            onPress={() => {
              changeLanguage('my');
            }}>
            <Text style={isDark ? darkLanguage.text : languageCss.text}>
              Bahasa Melayu
            </Text>
            {selectedLanguage === 'my' && (
              <Image
                source={require('../assets/tick.png')}
                style={languageCss.tick}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={languageCss.languageContainer}
            onPress={() => {
              changeLanguage('zh');
            }}>
            <Text style={isDark ? darkLanguage.text : languageCss.text}>
              中文
            </Text>
            {selectedLanguage === 'zh' && (
              <Image
                source={require('../assets/tick.png')}
                style={languageCss.tick}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Language;
