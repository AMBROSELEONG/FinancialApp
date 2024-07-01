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
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, languageCss} from '../objects/commonCss';
import React, {useCallback, useEffect, useState} from 'react';
import i18n from '../language/language';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemeChange from './ThemeChange';
import {darkCss, darkLanguage} from '../objects/darkCss';

const STORAGE_KEY = '@app_language';

const Language = () => {
  const navigation = useNavigation();

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
      console.error('Failed to load language', error);
    }
  };

  const saveLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.error('Failed to save language', error);
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

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      }
    })();
  }, []);

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
