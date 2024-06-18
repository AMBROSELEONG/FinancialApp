import MainContainer from '../components/MainContainer';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {
  KeyboardAvoidingView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {css, userEditCss} from '../objects/commonCss';
import {TextInput, HelperText} from 'react-native-paper';
import {useEffect, useState} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {UrlAccess} from '../objects/url';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserEdit = () => {
  const navigation = useNavigation();
  const [Username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [Email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [comfirmPassword, setConfirmPassword] = useState('');
  const [hidePass, setHidePass] = useState(true);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const storedUserID = await AsyncStorage.getItem('UserID');
        if (storedUserID !== null) {
          setUserId(storedUserID);
        }
      } catch (error) {
        console.error('Failed to load username from AsyncStorage', error);
      }
    };
    fetchUsername();
  }, []);

  useEffect(() => {
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
            setPassword(json.userData.password);
            setConfirmPassword(json.userData.password); // Assuming you want to set confirmPassword same as password initially
            setUsername(json.userData.userName);
          } else {
            console.log('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      };

      fetchData();
    }
  }, [userId]);

  return (
    <MainContainer>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar
          animated={true}
          backgroundColor="#3490DE"
          barStyle={'dark-content'}
        />
        <View style={[css.mainView, {backgroundColor: '#3490DE'}]}>
          <TouchableOpacity
            style={{paddingLeft: 20}}
            onPress={() => {
              navigation.goBack();
            }}>
            <Ionicons name="arrow-back" size={30} color={'#fff'} />
          </TouchableOpacity>
          <View style={css.HeaderView}>
            <Text style={[css.PageName, {color: '#fff'}]}>Edit Profile</Text>
          </View>
        </View>
        <View style={userEditCss.container}>
          <View style={userEditCss.header}>
            <View style={userEditCss.imageContainer}>
              <Image
                source={require('../assets/User.png')}
                style={userEditCss.image}
              />
            </View>
          </View>
          <View>
            <Text style={userEditCss.Title}>User Information</Text>
            <TextInput
              label="Username"
              mode="outlined"
              style={userEditCss.Input}
              placeholder="Please Enter Your User Name"
              //   theme={theme}
              value={Username}
              onChangeText={text => setUsername(text)}
            />
            <TextInput
              label="Email"
              mode="outlined"
              style={userEditCss.Input}
              placeholder="Please Enter Your Email"
              //   theme={theme}
              value={Email}
              onChangeText={text => setEmail(text)}
            />
            <TextInput
              label="Password"
              mode="outlined"
              style={userEditCss.Input}
              placeholder="Please Enter Your Password"
              //   theme={theme}
              value={password}
              onChangeText={text => setPassword(text)}
              autoCapitalize="none"
              secureTextEntry={hidePass ? true : false}
              right={
                <TextInput.Icon
                  icon={hidePass ? 'eye-off' : 'eye'}
                  onPress={() => setHidePass(!hidePass)}
                />
              }
            />
            <TextInput
              label="Confirm Password"
              mode="outlined"
              style={userEditCss.Input}
              placeholder="Please Enter Your Confirm Password"
              //   theme={theme}
              onChangeText={text => setConfirmPassword(text)}
              autoCapitalize="none"
              secureTextEntry={hidePass ? true : false}
              right={
                <TextInput.Icon
                  icon={hidePass ? 'eye-off' : 'eye'}
                  onPress={() => setHidePass(!hidePass)}
                />
              }
            />

            <TouchableOpacity style={userEditCss.Button}>
              <Text style={userEditCss.ButtonText}>Save Change</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default UserEdit;
