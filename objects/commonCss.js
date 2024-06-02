import { DefaultTheme, Title } from 'react-native-paper';
import { Dimensions, StyleSheet } from "react-native";

const whiteTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

export default whiteTheme;

export const WelcomeCss = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  Logo: {
    alignSelf: 'center',
    marginTop: '30%',
    marginBottom: Dimensions.get('screen').height / 100 * 30,
    width: '70%'
  },
  Login: {
    width: '70%',
    backgroundColor: "#3490DE",
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  BtnText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#FFF',
  },
  SignUp: {
    width: '70%',
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 30
  }
})

export const SignInCss = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'column'
  },
  Logo: {
    alignSelf: 'center',
    marginTop: '5%',
    width: 220,
    height: 150
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginTop: '10%'
  },
  Content: {
    fontSize: 16,
    marginTop: '5%',
    textAlign: 'center',
    color: '#000',
  },
  Input: {
    marginTop: '5%',
    width: '80%',
    alignSelf: 'center',
    borderRadius: 20
  },
  InputError: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: -20
  },
  Forgot: {
    fontSize: 12,
    color: '#8B8B8B',
    alignSelf: 'flex-end',
    marginRight: '10%',
    marginBottom: '5%'
  },
  LoginButton: {
    width: '80%',
    backgroundColor: "#3490DE",
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
  },
  BtnText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#FFF',
  },
  Other: {
    width: '80%',
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: '10%',
    marginBottom: '10%'
  },
  Line: {
    flex: 1,
    height: 1,
    backgroundColor: '#AAAAAA',
    alignSelf: 'center'
  },
  Or: {
    fontSize: 12,
    color: '#8B8B8B',
    marginHorizontal: 10,
  },
  Finger: {
    width: Dimensions.get('screen').width / 100 * 12,
    height: Dimensions.get('screen').width / 100 * 12,
    alignSelf: 'center',
  },
  SignUp: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 10
  },
})

export const VerifyCss = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  Back: {
    width: 30,
    height: 30,
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 20,
    marginBottom: 10
  },
  SubTitle: {
    fontSize: 16,
    color: '#A4A4A4',
    marginHorizontal: 20
  },
  img: {
    alignSelf: 'center',
    marginVertical: "10%"
  },
  Input: {
    fontSize: 24,
    color: "#000",
    textAlign: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    margin: 2
  },
  Pin: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  Btn: {
    width: '70%',
    padding: 15,
    backgroundColor: '#3490DE',
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: '20%'
  },
  font: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center'
  },
  resend: {
    fontSize: 14,
    color: '#0006FF',
    marginLeft: '10%',
    marginTop: '5%'
  },
  time: {
    fontSize: 14,
    color: '#000',
    marginLeft: '10%',
    marginTop: '5%'
  },
  SignIn: {
    fontSize: 14,
    color: '#0006FF',
    marginLeft: '10%',
    marginTop: '5%'
  },
  ModalView:{
    width: '100%',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#F5F5F599'
  },
  ModalContainer: {
    width: '60%',
    height: Dimensions.get('screen').width /1.4,
    backgroundColor: '#ffffff',
    alignSelf: 'center',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  TextModal:{
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15
  },
  ButtonModal:{
    width: '80%',
    height: 45,
    backgroundColor: '#F15249',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20
  },
  ButtonText:{
    color: '#ffffff', 
    textAlign: 'center', 
    fontSize: 16, 
    lineHeight: 45, 
    fontWeight: 'bold'
  }
})