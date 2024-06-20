import {DefaultTheme, Modal, Title} from 'react-native-paper';
import {Dimensions, StyleSheet} from 'react-native';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

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
    marginBottom: (Dimensions.get('screen').height / 100) * 30,
    width: '70%',
  },
  Login: {
    width: '70%',
    backgroundColor: '#3490DE',
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
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 30,
  },
});

export const SignInCss = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    flexDirection: 'column',
  },
  Logo: {
    alignSelf: 'center',
    marginTop: '5%',
    width: 220,
    height: 150,
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginTop: '10%',
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
    borderRadius: 20,
  },
  InputError: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: -20,
  },
  Forgot: {
    fontSize: 12,
    color: '#8B8B8B',
    alignSelf: 'flex-end',
    marginRight: '10%',
    marginBottom: '5%',
  },
  LoginButton: {
    width: '80%',
    backgroundColor: '#3490DE',
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
    marginBottom: '10%',
  },
  Line: {
    flex: 1,
    height: 1,
    backgroundColor: '#AAAAAA',
    alignSelf: 'center',
  },
  Or: {
    fontSize: 12,
    color: '#8B8B8B',
    marginHorizontal: 10,
  },
  Finger: {
    width: (Dimensions.get('screen').width / 100) * 12,
    height: (Dimensions.get('screen').width / 100) * 12,
    alignSelf: 'center',
  },
  SignUp: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
    bottom: 10,
  },
  Send: {
    width: '80%',
    backgroundColor: '#3490DE',
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: (Dimensions.get('screen').height / 100) * 40,
  },
  Reset: {
    width: '80%',
    backgroundColor: '#3490DE',
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: (Dimensions.get('screen').height / 100) * 10,
  },
});

export const VerifyCss = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#FFF',
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
    marginBottom: 10,
  },
  SubTitle: {
    fontSize: 16,
    color: '#A4A4A4',
    marginHorizontal: 20,
  },
  img: {
    alignSelf: 'center',
    marginVertical: '10%',
  },
  Input: {
    fontSize: 24,
    color: '#000',
    textAlign: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    margin: 2,
  },
  Pin: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  Btn: {
    width: '70%',
    padding: 15,
    backgroundColor: '#3490DE',
    borderRadius: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: '20%',
  },
  font: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  resend: {
    fontSize: 14,
    color: '#0006FF',
    marginLeft: '10%',
    marginTop: '5%',
  },
  time: {
    fontSize: 14,
    color: '#000',
    marginLeft: '10%',
    marginTop: '5%',
  },
  SignIn: {
    fontSize: 14,
    color: '#0006FF',
    marginLeft: '10%',
    marginTop: '5%',
  },
  ModalView: {
    width: '100%',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#F5F5F599',
  },
  ModalContainer: {
    width: '60%',
    height: Dimensions.get('screen').width / 1.4,
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
  TextModal: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
  ButtonModal: {
    width: '80%',
    height: 45,
    backgroundColor: '#F15249',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 20,
  },
  ButtonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 45,
    fontWeight: 'bold',
  },
});

export const css = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mainView: {
    width: '100%',
    height: (Dimensions.get('screen').height / 100) * 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  HeaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12%',
  },
  PageName: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export const customCss = StyleSheet.create({
  header: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: (Dimensions.get('screen').height / 100) * 8,
    marginRight: 20,
  },
});

export const homeCss = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  welcome: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
    marginLeft: (Dimensions.get('screen').width / 100) * 6,
  },
  user: {
    color: '#3490DE',
    fontWeight: 'bold',
    fontSize: 26,
    marginLeft: (Dimensions.get('screen').width / 100) * 6,
  },
  dateContainer: {
    width: (Dimensions.get('screen').width / 100) * 60,
    height: (Dimensions.get('screen').width / 100) * 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginTop: 20,
  },
  date: {
    color: '#8D8D8D',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: (Dimensions.get('screen').width / 100) * 10,
    fontWeight: 'bold',
  },
  spendContainer: {
    width: (Dimensions.get('screen').width / 100) * 95,
    height: (Dimensions.get('screen').width / 100) * 90,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
    alignSelf: 'center',
    marginTop: 20,
    padding: 5,
  },
  spend: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  chartContainer: {
    width: '100%',
    marginTop: 10,
  },
  xAxisLabel: {
    color: '#000',
  },
  totalText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  total: {
    color: '#3490DE',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export const settingCss = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  UserContainer: {
    width: '100%',
    height: (Dimensions.get('screen').width / 100) * 25,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  EditContainer: {
    width: '100%',
    height: (Dimensions.get('screen').width / 100) * 20,
    backgroundColor: '#fff',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  PrefenceContainer: {
    width: '100%',
    height: (Dimensions.get('screen').height / 100) * 50,
    backgroundColor: '#fff',
    marginTop: 30,
  },
  UserImage: {
    width: (Dimensions.get('screen').width / 100) * 15,
    height: (Dimensions.get('screen').width / 100) * 15,
    borderWidth: 2,
    borderRadius: (Dimensions.get('screen').width / 100) * 10,
    marginLeft: 15,
    alignSelf: 'center',
  },
  UserInfoContainer: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  UserName: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
  },
  Email: {
    color: '#6F6F6F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  EditIcon: {
    width: (Dimensions.get('screen').width / 100) * 7,
    height: (Dimensions.get('screen').width / 100) * 7,
    borderWidth: 2,
    marginLeft: 15,
    alignSelf: 'center',
  },
  text: {
    color: '#000',
    fontSize: 18,
  },
  TextContainer: {
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  EditButton: {
    width: (Dimensions.get('screen').width / 100) * 20,
    height: (Dimensions.get('screen').width / 100) * 10,
    backgroundColor: '#3490DE',
    alignSelf: 'center',
    marginHorizontal: 20,
    borderRadius: 10,
  },
  ButtonText: {
    color: '#fff',
    lineHeight: (Dimensions.get('screen').width / 100) * 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  PrefenceText: {
    color: '#6E6E6E',
    fontWeight: 'bold',
    margin: 20,
    fontSize: 16,
  },
  FunctionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  ClickIcon: {
    marginRight: 30,
  },
});

export const languageCss = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
  },
  languageContainer: {
    flexDirection: 'row',
    width: '90%',
    borderBottomWidth: 0.5,
    borderColor: '#808080',
    alignSelf: 'center',
    height: (Dimensions.get('screen').width / 100) * 15,
  },
  text: {
    color: '#000',
    alignSelf: 'center',
  },
  tick: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginLeft: 20,
  },
});

export const userEditCss = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    position: 'relative',
  },
  header: {
    backgroundColor: '#3490DE',
    height: (Dimensions.get('screen').height / 100) * 13,
  },
  imageContainer: {
    width: (Dimensions.get('screen').width / 100) * 28,
    height: (Dimensions.get('screen').width / 100) * 28,
    backgroundColor: '#ffffff',
    borderRadius: Dimensions.get('screen').width * 100,
    position: 'absolute',
    alignSelf: 'center',
    top: (Dimensions.get('screen').height / 100) * 6,
  },
  image: {
    width: (Dimensions.get('screen').width / 100) * 24,
    height: (Dimensions.get('screen').width / 100) * 24,
    borderWidth: 1,
    borderRadius: Dimensions.get('screen').width * 100,
    alignSelf: 'center',
    marginVertical: (Dimensions.get('screen').width / 100) * 2,
  },
  Title: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: (Dimensions.get('screen').height / 100) * 5,
    marginLeft: (Dimensions.get('screen').width / 100) * 5,
  },
  Input: {
    width: '90%',
    alignSelf: 'center',
    marginTop: (Dimensions.get('screen').height / 100) * 1,
  },
  Button: {
    width: (Dimensions.get('screen').width / 100) * 80,
    height: (Dimensions.get('screen').width / 100) * 15,
    alignSelf: 'center',
    backgroundColor: '#3490DE',
    borderRadius: 20,
    marginTop: (Dimensions.get('screen').height / 100) * 20,
  },
  ButtonText: {
    color: '#fff',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: (Dimensions.get('screen').width / 100) * 15,
  },
  InputError: {
    width: '80%',
    alignSelf: 'left',
    marginLeft: 10,
    marginBottom: -10,
  },
});

export const walletCss = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#3490DE',
    flex: 1,
    width: '100%',
  },
  body: {
    flex: 3,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: (Dimensions.get('screen').height / 100) * 6,
    zIndex: -1,
  },
  balanceText: {
    color: '#E5E5E5',
    fontSize: 20,
    marginHorizontal: '6%',
  },
  balance: {
    color: '#fff',
    fontSize: 36,
    marginHorizontal: '6%',
    fontWeight: 'bold',
  },
  positionContainer: {
    width: '80%',
    height: (Dimensions.get('screen').height / 100) * 10,
    backgroundColor: '#fff',
    position: 'absolute',
    alignSelf: 'center',
    top: '75%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    paddingVertical: (Dimensions.get('screen').width / 100) * 4,
  },
  icon: {
    alignSelf: 'center',
    width: (Dimensions.get('screen').width / 100) * 8,
    height: (Dimensions.get('screen').width / 100) * 8,
  },
  text: {
    color: '#3490DE',
    textAlign: 'center',
    fontSize: 18,
  },
  TabBackground: {
    flex: 1,
    backgroundColor: '#fff',
  },
  TableHeader: {
    textAlign: 'center',
  },
  cell: {
    justifyContent: 'center',
  },
  evenRowIncome: {
    backgroundColor: '#3490DE50',
  },
  evenRowSpend: {
    backgroundColor: '#DE343450',
  },
  oddRow: {
    backgroundColor: '#ffffff',
  },
});

export const walletIncomeCss = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  title: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '7%',
  },
  subtitle: {
    color: '#999999',
    marginLeft: '7%',
    fontSize: 16,
  },
  balance: {
    color: '#000',
    marginLeft: '7%',
    fontSize: 32,
    fontWeight: 'bold',
  },
  Input: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#EEEEEE',
  },
  InputError: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: -20,
  },
  label: {
    color: '#3490DE',
    marginLeft: '7%',
    marginTop: (Dimensions.get('screen').height / 100) * 3,
    marginBottom: 5,
  },
  Button: {
    width: '80%',
    height: (Dimensions.get('screen').width / 100) * 13,
    backgroundColor: '#3490DE',
    alignSelf: 'center',
    borderRadius: 10,
    position: 'absolute',
    bottom: 30,
  },
  ButtonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: (Dimensions.get('screen').width / 100) * 13,
  },
});

export const bankCss = StyleSheet.create({
  addButton: {
    width: (Dimensions.get('screen').width / 100) * 15,
    height: (Dimensions.get('screen').width / 100) * 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
    position: 'absolute',
    bottom: 15,
    right: 15,
    zIndex: 1,
  },
  addIcon: {
    alignSelf: 'center',
    lineHeight: (Dimensions.get('screen').width / 100) * 15,
  },
  ModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ModalView: {
    width: (Dimensions.get('screen').width / 100) * 80,
    height: (Dimensions.get('screen').width / 100) * 120,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  ButtonClose: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  ModalTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  Input: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#EEEEEE',
  },
  InputError: {
    width: '80%',
    alignSelf: 'center',
    marginBottom: -20,
  },
  label: {
    color: '#3490DE',
    marginLeft: '7%',
    marginTop: (Dimensions.get('screen').height / 100) * 3,
    marginBottom: 5,
  },
  SaveButton: {
    width: '90%',
    height: (Dimensions.get('screen').width / 100) * 12,
    backgroundColor: '#3490DE',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    borderRadius: 10,
  },
  SaveText: {
    color: '#fff',
    textAlign: 'center',
    lineHeight: (Dimensions.get('screen').width / 100) * 12,
    fontSize: 20,
  },
  listContainer: {
    width: '95%',
    height: (Dimensions.get('screen').width / 100) * 20,
    backgroundColor: '#fff',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 30,
  },
  bank: {
    color: '#000',
    fontSize: 20,
    flex: 1,
    fontWeight: 'bold',
    lineHeight: (Dimensions.get('screen').width / 100) * 20,
  },
  balance: {
    color: '#3490DE',
    fontSize: 20,
    flex: 1,
    fontWeight: 'bold',
    lineHeight: (Dimensions.get('screen').width / 100) * 20,
  },
});
