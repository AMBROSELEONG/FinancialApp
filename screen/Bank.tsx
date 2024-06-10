import {useState} from 'react';
import MainContainer from '../components/MainContainer';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css} from '../objects/commonCss';

const Bank = () => {
  const navigation = useNavigation();

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar
          animated={true}
          backgroundColor="#fff"
          barStyle={'dark-content'}
        />
        <View style={css.mainView}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.dispatch(DrawerActions.openDrawer());
            }}>
            <Ionicons name="menu" size={30} color={'#000'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={css.PageName}>Bank</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default Bank;
