import {DefaultTheme, Modal, Title} from 'react-native-paper';
import {Dimensions, StyleSheet} from 'react-native';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000',
  },
};

export default darkTheme;

export const darkWelcome = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
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

export const darkSignIn = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    color: '#fff',
    marginTop: '10%',
  },
  Content: {
    fontSize: 16,
    marginTop: '5%',
    textAlign: 'center',
    color: '#fff',
  },
  Input: {
    marginTop: '5%',
    width: '80%',
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#000'
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
    color: '#fff',
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

export const darkVerify = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#000',
  },
  Back: {
    width: 30,
    height: 30,
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
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
    backgroundColor: '#000',
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
    color: '#fff',
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

export const darkCss = StyleSheet.create({
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
    backgroundColor: '#000',
  },
  HeaderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '12%',
  },
  PageName: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export const darkCustom = StyleSheet.create({
  header: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: (Dimensions.get('screen').height / 100) * 8,
    marginRight: 20,
  },
});

export const darkHome = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  welcome: {
    color: '#fff',
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
    backgroundColor: '#202020',
    alignSelf: 'center',
    marginTop: 20,
  },
  date: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: (Dimensions.get('screen').width / 100) * 10,
    fontWeight: 'bold',
  },
  spendContainer: {
    width: (Dimensions.get('screen').width / 100) * 95,
    height: (Dimensions.get('screen').width / 100) * 90,
    backgroundColor: '#202020',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    elevation: 5,
    alignSelf: 'center',
    marginTop: 20,
    padding: 5,
  },
  spend: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
  chartContainer: {
    width: '100%',
    marginTop: 10,
  },
  xAxisLabel: {
    color: '#fff',
  },
  totalText: {
    color: '#fff',
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

export const darkSetting = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#000000',
  },
  UserContainer: {
    width: '100%',
    height: (Dimensions.get('screen').width / 100) * 25,
    backgroundColor: '#202020',
    flexDirection: 'row',
  },
  EditContainer: {
    width: '100%',
    height: (Dimensions.get('screen').width / 100) * 20,
    backgroundColor: '#202020',
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  PrefenceContainer: {
    width: '100%',
    height: (Dimensions.get('screen').height / 100) * 50,
    backgroundColor: '#202020',
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  Email: {
    color: '#cccccc',
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
    color: '#fff',
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
    color: '#fff',
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
    position: 'absolute',
    right: 0,
  },
});

export const darkLanguage = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#000',
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
    color: '#fff',
    alignSelf: 'center',
  },
  tick: {
    width: 20,
    height: 20,
    alignSelf: 'center',
    marginLeft: 20,
  },
});

export const darkUserEdit = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#202020',
    position: 'relative',
  },
  header: {
    backgroundColor: '#000',
    height: (Dimensions.get('screen').height / 100) * 13,
  },
  imageContainer: {
    width: (Dimensions.get('screen').width / 100) * 28,
    height: (Dimensions.get('screen').width / 100) * 28,
    backgroundColor: '#202020',
    borderRadius: Dimensions.get('screen').width * 100,
    position: 'absolute',
    alignSelf: 'center',
    top: (Dimensions.get('screen').height / 100) * 6,
  },
  image: {
    width: (Dimensions.get('screen').width / 100) * 24,
    height: (Dimensions.get('screen').width / 100) * 24,
    borderWidth: 1,
    borderRadius: (Dimensions.get('screen').width / 100) * 12,
    alignSelf: 'center',
    marginVertical: (Dimensions.get('screen').width / 100) * 2,
  },
  Title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: (Dimensions.get('screen').height / 100) * 5,
    marginLeft: (Dimensions.get('screen').width / 100) * 5,
  },
  Input: {
    width: '90%',
    alignSelf: 'center',
    marginTop: (Dimensions.get('screen').height / 100) * 1,
    backgroundColor: '#000',
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

export const darkWallet = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#000',
    flex: 1,
    width: '100%',
  },
  body: {
    flex: 3,
    backgroundColor: '#202020',
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
    backgroundColor: '#202020',
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
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  TabBackground: {
    flex: 1,
    backgroundColor: '#202020',
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
    backgroundColor: '#202020',
  },
});

export const darkWalletIncome = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
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
    color: '#fff',
    marginLeft: '7%',
    fontSize: 32,
    fontWeight: 'bold',
  },
  Input: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#000',
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

export const darkBank = StyleSheet.create({
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
